import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { tarea } from './model/tarea';
import {NgForm} from '@angular/forms';
import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, {static: true}) mdbTable: MdbTableDirective;
  @ViewChild ('frame') public modal: any ; 
  @ViewChild ('frames') public modalSuccess: any  

  
  title = 'prueba-tecnica';
  message='';

  headElements = ['id', 'tareas'];
  searchText: string = '';
  previous: string;

  textTarea:string='';
  terminada:boolean;
  elements: any = [];

  tarea:tarea;
  editField: string;
  tareaList:Array<tarea>=[];


  constructor(private _game: GameService,
    private cdRef: ChangeDetectorRef){}

  ngOnInit() {
    this.initFeedback();
    
  }

  initFeedback() {
    this._game.getAvailability().subscribe(
      (res: any) => {
        if (res !== null) {  
          this.tareaList = res;
          this.mdbTable.setDataSource(this.tareaList);
          this.previous = this.mdbTable.getDataSource();
        }
      });
  }

  save(data:tarea){
    this._game.insertBase(data).subscribe((res: any) => {
        if (res) {
          this.initFeedback();
          this.message='Se agrego correctamente.';
          this.modalSuccess.show();
        } 
    });
  }
  
  updateList(data:tarea,val) {
    data.state = val.checked;
    this._game.updateBase(data).subscribe((res: any) => {
      if (res) {
        this.message='Se actualizo correctamente. ';
        this.modalSuccess.show();
      } 
  });
  }
 

  remove(id: any) {
    this.tareaList.splice(id, 1);
    this._game.deleteBase(id).subscribe((res: any) => {
      if (res) {
        this.initFeedback();
        this.message='Se elimino correctamente. ';
        this.modalSuccess.show();
      } 
  });
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  onSubmit(f: NgForm) {
    this.tarea=f.value;
    if(this.tarea.title=="")
    {
      this.message="Tiene que agregar un título.";
      this.modal.show();
    }else if(this.tareaList.filter(x=>x.title==this.tarea.title).length>0){
      this.message="El nombre de la tarea ya existe.";
      this.modal.show();
    }else{
      this.tarea.id = this.tareaList.length+1;
      this.tareaList.push(this.tarea);      
      this.save(this.tarea);
      
    }
  }
  onClose(event: any) {
    console.log(event);    
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
         this.mdbTable.setDataSource(this.previous);
         this.tareaList = this.mdbTable.getDataSource();
        
    }
    if (this.searchText) {
        this.tareaList = this.mdbTable.searchLocalDataBy(this.searchText);
        this.mdbTable.setDataSource(prev);
    }
  }
  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
}
