
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { totalTypes } from '../../modal/interface'
import { select, Store } from '@ngrx/store';



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
  formdata: FormGroup;
  customProp = {};
  path: Array<string>;
  arrayItem;
  schemaType;
  newField = false;
  isOptional = false;
  isNewRecord = false;

  constructor(private store: Store<any>, private fb: FormBuilder) { }

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
        // this.isNewRecord = false;
      }
    );
    this.formdata = this.fb.group({
      nameid: new FormControl(),
      docid: new FormControl(),
      defaultid: new FormControl(),
      typeid: new FormArray([]),
      nullid: new FormControl(),
      keyid: new FormControl(),
      valueid: new FormControl(),
      newRecordType: new FormGroup({})
    });


  }




  onChangeInit(schema) {
    this.type = new Array<string>()
    this.isOptional = false
    this.customProp = this.getCustomeProperties(schema);
    this.schemaType = schema.type;
    if (typeof schema.type == "object") {
      if (this.isArray(schema.type)) {

        schema.type.forEach((element, n) => {
          if (element == 'null')
            this.isOptional = true
          if (element != 'null') {
            if (typeof element == "object") {
              this.type.push(element.type);
              if (element.type == 'array') {
                if (typeof element.items == 'object') {
                  this.arrayItem = element.items.type
                } else {
                  this.arrayItem = element.items
                }
              }
            } else {
              this.type.push(element);
            }
          }
        });
      } else {
        this.type.push(schema.type.type)
      }

    } else {
      this.type.push(schema.type)
    }

    this.formdata = new FormGroup({
      nameid: new FormControl(schema.name),
      docid: new FormControl(schema.doc),
      typeid: new FormGroup(
        {
          string: new FormControl(this.type.find(a => a.includes("string"))),
          int: new FormControl(this.type.find(a => a.includes("int"))),
          boolean: new FormControl(this.type.find(a => a.includes("boolean"))),
          long: new FormControl(this.type.find(a => a.includes("long"))),
          double: new FormControl(this.type.find(a => a.includes("double"))),
          array: new FormControl(this.type.find(a => a.includes("array"))),
          record: new FormControl(this.type.find(a => a.includes("record"))),
          default: new FormControl(''),
        }
      ),
      defaultid: new FormControl(schema.default),
      nullid: new FormControl(this.isOptional),
      itemid: new FormControl(this.arrayItem),
      newRecordType: this.fb.group({
        type: "record",
        name: new FormControl(''),
        doc: new FormControl(''),
        fields: new FormArray([])
      })
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
    if (data)
      field.type = this.type == 'record' || this.type === 'array' ? this.schemaType : this.type;
    if (data.docid)
      field.doc = data.docid
    this.setCustomeProperties(field);
    return field;
  }

  onCheckboxChange(e) {
    this.evaluteTypeField(e.target.checked);
  }

  onDataTypeChange(neu, old) {
    if (neu == 'record') {
      this.isNewRecord = true;
      neu = this.formdata.value.newRecordType
    }
    this.type = this.type.filter(e => e !== old); //discarding 'old' values from the array
    this.type.push(neu)
    this.evaluteTypeField(this.formdata.value.nullid);
 

  }

  evaluteTypeField(condition: boolean) {
    if (condition) {
      this.type.push("null")
    }
    this.type = this.type.filter(function (elem, index, self) { // removing duplicate values
      return index === self.indexOf(elem);
    })
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

  }


  addProperties() {
    Object.assign(this.customProp, { "new key": "" })
  }
  removeProperties(key: string) {
    this.deleteKey[this.deleteKeyCount++] = key;
    delete this.customProp[key],
      this.onClickSubmit(this.formdata.value)
  }



  addType() {
    this.type.push("long")
  }


  removeType(obj: number) {
    this.type.splice(obj, 1)
    this.onClickSubmit(this.formdata.value)
  }


  getTypeof(obj:any){
return typeof(obj)
  }


}
