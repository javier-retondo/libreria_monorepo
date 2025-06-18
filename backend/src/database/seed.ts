import { Author, Category, initAssociations, UserRole } from '../models';
import { createUser, getUserByEmail } from '../services/User';
import categories from './data/categories.json';
import authors from './data/authors.json';
import books from './data/books.json';
import { join } from 'path';
import { copyFileSync } from 'fs';
import sequelize from '.';
import { createBook } from '../services/Book';
import * as dotenv from 'dotenv';

dotenv.config({
  path: join(__dirname, '..', '..', '.env'),
});

async function seed() {
  console.log('join(__dirn ', join(__dirname, '..', '..', '.env'));
  console.log('Iniciando el proceso de seed...');
  initAssociations();
  await seedSuperUser();
  await seedCategories();
  await seedAuthors();
  await seedBooks();
  console.log('Proceso de seed completado.');
  console.log('-----------------------------------');

  console.log('Todos los datos han sido sembrados correctamente.');
  process.exit();
}

async function seedSuperUser() {
  console.log('Creando Super Usuario...');
  const name = process.env.SUPER_ADMIN_NAME || 'admin';
  const email = process.env.SUPER_ADMIN_EMAIL || 'info@javier-retondo.ar';

  const userExists = await getUserByEmail(email);
  if (userExists) {
    console.log(`El usuario ${email} ya existe. No se creará de nuevo.`);
    return;
  }

  await createUser(name, email, UserRole.ADMIN).catch((error) => {
    console.error('Error al crear al usuario:', error);
  });
  console.log(`Super Usuario creado: ${name} (${email})`);
}

async function seedCategories() {
  console.log('Creando categorías...');
  await Category.bulkCreate(categories)
    .then(() => {
      console.log('Categorías creadas correctamente');
    })
    .catch((error) => {
      console.error('Error al crear las categorías:', error);
    });
}

async function seedAuthors() {
  console.log('Creando autores...');
  await Author.bulkCreate(
    authors.map((author) => ({
      ...author,
      fecha_nacimiento: new Date(author.fecha_nacimiento),
    })),
  )
    .then(() => {
      console.log('Autores creados correctamente');
    })
    .catch((error) => {
      console.error('Error al crear los autores:', error);
    });
}

async function seedBooks() {
  console.log('Creando libros...');
  const transaction = await sequelize.transaction();
  const imagesFilePathFrom = join(__dirname, 'data', 'img');
  const imagesFilePath = join(__dirname, '..', '..', 'public', 'img');
  await Promise.all(
    books.map(async (book) => {
      const { titulo, descripcion, precio, imagen, autor_id, categorias } =
        book;
      await createBook(
        {
          titulo,
          descripcion,
          precio,
          imagen_url: imagen,
          autor_id,
        },
        categorias.map((categoria) => categoria.id),
        transaction,
      )
        .then(() => {
          const sourcePath = join(
            imagesFilePathFrom,
            imagen.split('/').pop() || '',
          );
          const destPath = join(imagesFilePath, imagen.split('/').pop() || '');
          copyFileSync(sourcePath, destPath);
          console.log(`Libro creado: ${titulo}`);
        })
        .catch((error) => {
          console.error(`Error al crear el libro ${titulo}:`, error);
          if (transaction) {
            transaction.rollback();
          }
        });
    }),
  );

  await transaction.commit();

  console.log('Libros creados');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
