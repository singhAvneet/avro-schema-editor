import { Component, Input} from "@angular/core";
import { select, Store } from "@ngrx/store";

@Component({
  selector: 'app-schema-edit',
  styleUrls: ['./schema-edit.component.scss'],
  templateUrl: './schema-edit.component.html'
})
export class SchemaEditorComponent {
  name: any;

  @Input() schemas: any;
  @Input() path: Array<string>;

  constructor(private store: Store<any>) {


    
  }
  // addNewField() {
  //   this.store.dispatch({
  //     type: 'EDIT',
  //     payload: { type: 'EDIT', path: this.path, new:true,node:{} }
  //   });
  // }


  
}