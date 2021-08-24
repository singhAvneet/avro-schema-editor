import { Component, Output, EventEmitter, Input, ErrorHandler, ɵSWITCH_RENDERER2_FACTORY__POST_R3__ } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { GMS, totalTypes } from './schemaEditor/modal/interface';
import { select, Store } from '@ngrx/store';
import { splitClasses } from '@angular/compiler';




@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements ErrorHandler {

  handleError(error) {
    this.error = error
  }

  schemas: any;
  path = new Array<string>();
  nodePath = new Array<string>();
  totalTypes = totalTypes;
  error;


  result: any;
  break: boolean = false;
  newField: boolean = false;

  constructor(private store: Store<any>) {

  }
  fileChanged(e) {

    this.uploadDocument(e.target.files[0]);
  }


  uploadDocument(file) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.schemas = JSON.parse(fileReader.result.toString());
      this.path.push(this.schemas.name)
    }
    fileReader.readAsText(file);

  }


  ngOnInit() {
    this.schemas = { "type": "record", "namespace": "gms.com", "name": "gms", "fields": [] };
    this.store.pipe(select('node')).subscribe(
      domain => {
        this.result = {};
        this.break = false;
        if (domain) {
          if (domain.type == "NODE") {
            this.result = domain;
            this.editField(this.schemas, 1)
          }
          if (domain.type == "EMIT") {
            this.nodePath = domain.path

          }
        }
      }
    )

  }


  addNewField() {
    var path: string[] = ["gms"];
    for (var i = 1; i < this.nodePath.length - 1; i++)
      path.push(this.nodePath[i])


    // var path=this.path.pop;
    this.store.dispatch({
      type: 'EMIT',
      payload: { type: 'EMIT', path: path, new: true, node: {type:"default"} }
    });
  }


  removeField(schemas: any, i: number) {
    this.result.path = this.nodePath;


    if (i < this.result.path.length) {
      Object.keys(schemas.fields).forEach((k, n) => {
        if (schemas.fields[k])
          if (schemas.fields[k].name === this.result.path[i] && !this.break) {

            if (typeof schemas.fields[k].type === 'object') {
              if (Array.isArray(schemas.fields[k].type)) {
                Object.keys(schemas.fields[k].type).forEach(e => {
                  if (schemas.fields[k].type[e] != 'null') {
                    if (typeof schemas.fields[k].type[e] === "object") {
                      if (schemas.fields[k].type[e].type === "record") {
                        this.removeField(schemas.fields[k].type[e], ++i)
                      }
                      if (schemas.fields[k].type[e].type === "array") {
                        if (typeof schemas.fields[k].type[e].items == 'object') {
                          if (schemas.fields[k].type[e].items.type == 'record')
                            this.removeField(schemas.fields[k].type[e].items, ++i)
                        }
                        else {
                          this.break = true;
                          schemas.fields.splice(n, 1)

                        }
                      }
                    }
                    else {
                      this.break = true;
                      setTimeout(() => {
                        schemas.fields.splice(n, 1)
                      }, 100);
                    
                    }
                  }
                })
              } else {
                if (schemas.fields[k].type.type === "record") {
                  this.removeField(schemas.fields[k].type, ++i)
                }
              }
            } else {
              this.break = true;
              schemas.fields.splice(n, 1)
            }
          }
      })
    } else {
      this.break = true

      // delete schemas.fields[this.result.path[]]
    }
  }


  editField(schemas: any, i: number) {
    // console.log("adding")
    if (i < this.result.path.length) {
      Object.keys(schemas.fields).forEach(k => {
        if (schemas.fields[k].name === this.result.path[i] && !this.break) {
          if (typeof schemas.fields[k].type === 'object') {
            if (Array.isArray(schemas.fields[k].type)) {
              Object.keys(schemas.fields[k].type).forEach(e => {
                if (schemas.fields[k].type[e] != 'null') {
                  if (typeof schemas.fields[k].type[e] === "object") {
                    if (schemas.fields[k].type[e].type === "record") {
                      this.editField(schemas.fields[k].type[e], ++i)
                    }
                    if (schemas.fields[k].type[e].type === "array") {
                      if (typeof schemas.fields[k].type[e].items == 'object') {
                        if (schemas.fields[k].type[e].items.type == 'record')
                          this.editField(schemas.fields[k].type[e].items, ++i)
                      }
                      else {
                        this.break = true;
                        schemas.fields[k] = this.result.node;
                      }
                    }
                  }
                  else {
                    this.break = true;
                    schemas.fields[k] = this.result.node;
                  }
                }
              })
            } else {
              if (schemas.fields[k].type.type === "record") {
                this.editField(schemas.fields[k].type, ++i)
              }
            }
          } else {
            this.break = true;
            schemas.fields[k] = this.result.node;
          }
        }
      })
    } else {
      this.break = true
      schemas.fields.push(this.result.node)
    }

  }



}

/**
 * JSON schema form demo
 */
@Component({
  template: ''
})
export class MainComponent {

  /**
   * need to access custom component registry
   * @param service   service for registering custom widgets etc.
   * @param route     allows selecting an example via URL
   */
  constructor(private route: ActivatedRoute) { }







}

