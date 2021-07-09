import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators,FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import {Catagory} from '../shared/catagory.model';
import { CatagoryService } from '../shared/catagory.service';
import {NotificationService} from '../shared/notification.service';
import { DialogService } from '../shared/dialog.service';

// define custom ErrorStateMatcher
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: NgForm | FormGroupDirective | null) {
    return control && control.invalid && control.touched;
  }
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [CatagoryService]
})

export class CategoriesComponent implements OnInit {
 
  catagoryForm = new FormGroup({
     _id  : new FormControl(''),
     catagoryFormControl : new FormControl('', [Validators.required])
  })
  
  // create instance of custom ErrorStateMatcher
  errorMatcher = new CustomErrorStateMatcher();
  
  constructor(public CatagorysService: CatagoryService,
     public notificationService: NotificationService,
     private dialogService: DialogService) { }

  catagories: Catagory[] = [];
  catagory : Catagory;
  searchValue : string;
  p: number = 1;
  public maxSize: number = 5;

  ngOnInit(): void {
       this.getCatagories();
  }

  private  getCatagories(){
    this.CatagorysService.getCatagories()
      .subscribe((catagories:any) => 
          this.catagories = catagories)
   /*
   this.service.getOpenings()
       .subscribe((opening:any) => 
           this.tempArr = opening)*/
  }

  Reset() {
    this.catagoryForm.reset();
  }
  
  initializeFromGroup(){
      this.catagoryForm.patchValue({
           catagoryField : ''
      })
  }

  
  _id             : string;
  catagoryField   : string;
  
  onSubmit(){

    if(this.catagoryForm.valid){

          const newCatagory =  {
               _id                : this._id,
               catagoryField      : this.catagoryField,
               Date               : Date.now(),
          } 
         
          this.CatagorysService.addCatagory(newCatagory)
          .subscribe((catagory:any) => {
              this.notificationService.success(':: Submitted successfully'); 
          },(err)=>{
              this.notificationService.warn('!Something went wrong');
          });

    }
          
          this.getCatagories();
          this.Reset();     
  }
 
  deleteCatgory(id:any){
    var catagories = this.catagories;
    this.dialogService.openConfirmDialog('Are you sure to delete this Catagory?')
       .afterClosed().subscribe(res=>{
           if(res){
             this.CatagorysService.deleteCatagory(id)
             .subscribe(data => {
                   if(data.n == 1)
                   {
                     for(var i=0;i<catagories.length;i++)
                     {
                       if(catagories[i]._id == id)
                       {
                         catagories.splice(i,1);
                       }
                     }
                   }
             })
   
             this.CatagorysService.refreshNeeded$
                .subscribe(() => {
                     this.getCatagories();
             });
   
             this.getCatagories();
             this.notificationService.warn('! Deleted Successfully');
            
           }
       })
  }
}
