
import { Component, Input, OnChanges, OnInit, SimpleChanges, } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Record, totalTypes, GMS } from '../../modal/interface'
import { select, Store } from '@ngrx/store';
import { CompileShallowModuleMetadata } from "@angular/compiler";



@Component({
  selector: 'app-form',
  styleUrls: ['./form.component.scss'],
  templateUrl: './form.component.html'
})
export class FormComponent {


  totalTypes = totalTypes;

  type: any;
  deleteKey = [];
  deleteKeyCount = 0;
  formdata;
  customProp = {};
  path: Array<string>;
  arrayItem;
  schemaType;
  newField = false;
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.pipe(select('node')).subscribe(
      domain => {
        if (domain) {

          if (domain.type == "EMIT") {
            this.onChangeInit(domain.node);
            this.path = domain.path
            this.newField = domain.new
          }



        }

      }
    );
    this.formdata = new FormGroup({
      nameid: new FormControl(),
      docid: new FormControl(),
      typeid: new FormControl(),
      defaultid: new FormControl(),
      nullid: new FormControl(),
      keyid: new FormControl(),
      valueid: new FormControl(),
    });

  }

  onChangeInit(schema) {

    this.customProp = this.getCustomeProperties(schema);
    this.schemaType = schema.type;
    if (typeof schema.type == "object") {
      if (this.isArray(schema.type)) {
       
        schema.type.forEach((element, n) => {
          if (element != 'null') {
            if (typeof element == "object") {
              this.type = element.type;
              if (element.type == 'array') {
                if (typeof element.items == 'object') {
                  this.arrayItem = element.items.type
                } else {
                  this.arrayItem = element.items
                }
              }
            } else {
              this.type =element;
            }
          }
        });
      } else {
        this.type = schema.type.type
      }

    } else {
      this.type = schema.type
    }
    this.formdata = new FormGroup({
      nameid: new FormControl(schema.name),
      docid: new FormControl(schema.doc),
      typeid: new FormControl(this.type),
      defaultid: new FormControl(schema.default),
      nullid: new FormControl(this.isArray(schema.type) ? true : false),
      itemid: new FormControl(this.arrayItem)
    });
  }


  isArray(type: any): boolean {
    return Array.isArray(type)
  }

  onClickSubmit(data) {

    const field = this.getEvaluteField(data)
    var newPath = new Array<string>();
    this.store.dispatch({
      type: 'NODE',
      payload: { type: 'NODE', path: this.path, new: false, node: field }
    });


    if (this.newField) {
      this.path.forEach((v, i) => {
        newPath.push(v)
        if (i == this.path.length - 1) {
          newPath.push(field.name)
          this.store.dispatch({
            type: 'EMIT',
            payload: { type: 'EMIT', path: newPath, new: false, node: field }
          });
        }
      })

    } else {
      this.path.forEach((v, i) => {
        if (i == this.path.length - 1) {
          newPath.push(field.name)
          this.store.dispatch({
            type: 'EMIT',
            payload: { type: 'EMIT', path: newPath, new: false, node: field }
          });
        } else newPath.push(v);
      })
    }

  }

  getEvaluteField(data): any {
    var field: any = {};
    this.evaluteTypeField(data.nullid);
    if (data.nameid)
      field.name = data.nameid;
    if (data.typeid)
      field.type = data.typeid == 'record' || data.typeid === 'array' ? this.schemaType : this.type;
    if (data.docid)
      field.doc = data.docid
    this.setCustomeProperties(field);
    return field;
  }

  onCheckboxChange(e) {
    this.evaluteTypeField(e.target.checked);
  }

  onDataTypeChange() {
    this.evaluteTypeField(this.formdata.value.nullid);

  }

  evaluteTypeField(condition: boolean) {
    if (condition) {
      this.type = new Array('null');
      this.type[1] = this.formdata.value.typeid
    } else {
      this.type = this.formdata.value.typeid
    }
  }

  getCustomeProperties(schema: any): any {
    var custome = {};
    this.deleteKey = [];
    this.deleteKeyCount = 0;
    for (var k in schema) {
      if (k != "name" && k != "doc" && k != "type") {

        custome[k] = schema[k]
      }
    }
    return custome
  }

  setCustomeProperties(field: any) {
    for (var k in this.customProp) {
      field[k] = this.customProp[k]
    }

    this.deleteKey.forEach(e => {
      delete field[e]
    });
    this.deleteKey = [];
    this.deleteKeyCount = 0
  }

  onChange(key: string, event) {
    if (event.target.name.startsWith('val')) {
      this.customProp[key] = event.target.value
    }
    if (event.target.name.startsWith('key')) {
      for (var k in this.customProp) {
        if (k == key && k != "") {
          this.deleteKey[this.deleteKeyCount++] = key;
          var val = this.customProp[k];
          delete this.customProp[k];
          this.customProp[event.target.value] = val
        } else {
          this.customProp[event.target.value] = ""
        }
      }
    }
    console.log(this.customProp)
  }


  addProperties() {
    Object.assign(this.customProp, { "new key": "" })
  }
  removeProperties(key: string) {
    this.deleteKey[this.deleteKeyCount++] = key;
    delete this.customProp[key],
      this.onClickSubmit(this.formdata.value)
  }

  // addNewField(){
  //   this.store.dispatch({
  //     type: 'ADD',
  //     payload: { type: 'ADD', path: this.path, node:this.getEvaluteField(this.formdata.value)}
  //   });
  // }


}
