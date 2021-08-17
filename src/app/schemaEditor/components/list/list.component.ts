

import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { totalTypes } from '../../modal/interface'
import { select, Store } from '@ngrx/store';


@Component({
  selector: 'app-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit , OnChanges{


  @Input() schemas: any;
  @Input() path: Array<string>;
  currentPath: Array<string> = new Array<string>();
  totalTypes = totalTypes;
  actualTypes = "[ ";
  hide: boolean = false;
  id: string;
  highlight: boolean = false;

  constructor(private store: Store<any>) {
    this.schemas = { "type": "record", "namespace": "gms.com", "name": "gms", "fields": [] };
  }
  ngOnChanges(changes: SimpleChanges): void {
// console.log("avneet",changes.path.currentValue)
  }
  generateUID(): string {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    return ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
  }
  isArray(type: any): boolean {
    return Array.isArray(type)
  }

  getTypeof(type: any): string {
    return typeof type;
  }
  emitSchema(event: Event) {
    this.highlight = true
    this.store.dispatch({
      type: 'HIGHLIGHT',
      payload: { type: 'HIGHLIGHT', id: this.id }
    }); 

   
    this.store.dispatch({
      type: 'EMIT',
      payload: { type: 'EMIT', path: this.currentPath, new:false,node: event }
    });

  }


  ngOnInit() {
    this.captureType();
    this.path.forEach(r => {
      this.currentPath.push(r)
    })

    this.currentPath.push(this.schemas.name);

    this.id = this.generateUID();

    this.store.pipe(select('node')).subscribe(
      domain => {      
        if (domain)
          if (domain.type == 'HIGHLIGHT')
            this.highlight = domain.id == this.id ? true : false

      })
      // console.log(this.path)
  }

  captureType() {
    if (Array.isArray(this.schemas.type)) {
      this.schemas.type.forEach(e => {
        if (typeof e === 'string') {
          this.actualTypes += e + " "
        } else {
          if (e.type === 'array' || e.type === 'record') {
            this.actualTypes += e.type + " ";
            if (e.items)
              this.hide = e.items.type == 'record' ? true : false;
            else
              this.hide = true;
          }


        }
      });
    } else {
      if (typeof this.schemas.type != 'object')
        this.actualTypes += this.schemas.type + " "

    }
    this.actualTypes += "]"
  }


}
