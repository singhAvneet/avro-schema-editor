

import { Component,  Input, OnInit,  } from "@angular/core";

@Component({
  selector: 'app-accordian',
  styleUrls: ['./acc.component.scss'],
  templateUrl: './acc.component.html'
})
export class AccordianComponent implements OnInit{
 


  @Input() schemas: any;

  @Input() path:Array<string> ;

  id:string;




  generateUID(): string {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    return ("000" + firstPart.toString(36)).slice(-3) + ("000" + secondPart.toString(36)).slice(-3);
  }
  ngOnInit(): void {
    this.id=this.generateUID();
   }



}
