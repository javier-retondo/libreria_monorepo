import {
  Author,
  Book,
  Category,
  BookCategory,
  User,
  Order,
  OrderItem,
  initAssociations,
} from '../models';

const modelsMap = {
  Author,
  Book,
  Category,
  BookCategory,
  User,
  Order,
  OrderItem,
};

const initAllModels = async (
  force?: boolean,
  alter?: boolean,
  modelName?: string,
  withAssociations?: boolean,
) => {
  if (withAssociations) {
    initAssociations();
  }

  console.log('   🔄 Iniciando sincronización de modelos...');
  if (modelName) {
    const model = modelsMap[modelName as keyof typeof modelsMap];
    if (!model) {
      console.error(`❌ Modelo "${modelName}" no encontrado.`);
      return;
    }
    console.log(`   🔄 Sincronizando modelo: ${modelName}`);
    await model.sync({ force, alter });
  } else {
    for (const [name, model] of Object.entries(modelsMap)) {
      console.log(`   🔄 Sincronizando modelo: ${name}`);
      await model.sync({ force, alter });
    }
  }

  console.log('✅ Modelos sincronizados correctamente.');
};

(async () => {
  let force;
  let alter;
  let model;
  let withAssociations = false;

  if (process.argv.length > 2) {
    const args = process.argv.slice(2);
    force = args.includes('--force') || args.includes('-f');
    alter = args.includes('--alter') || args.includes('-a');
    withAssociations = args.includes('--associations') || args.includes('-A');
    model = args.find((arg) => !arg.startsWith('--') && !arg.startsWith('-'));
  } else {
    force = false;
    alter = true;
    model = undefined;
    withAssociations = false;
    await initAllModels(force, alter, model, withAssociations);
    withAssociations = true;
  }
  console.log('model :>> ', model);
  console.log('force :>> ', force);
  console.log('alter :>> ', alter);
  console.log('withAssociations :>> ', withAssociations);
  await initAllModels(force, alter, model, withAssociations);
})()
  .catch((error) => {
    console.error('❌ Error al sincronizar modelos:', error);
  })
  .finally(() => {
    process.exit(0);
  });
