import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));




// const schemaText = readFileSync("example.avsc", "UTF8");
// const schema = JSON.parse(schemaText) as RecordType;
// console.log(avroToJSONSchema(schema as RecordType));