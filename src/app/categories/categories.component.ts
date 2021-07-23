import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';

import { AddCatagoryComponent } from '../add-catagory/add-catagory.component';
import { Catagory } from '../shared/catagory.model';
import { CatagoryService } from '../shared/catagory.service';
import { FaqService} from '../shared/faq.service';
import { NotificationService } from '../shared/notification.service';
import { DialogService } from '../shared/dialog.service';
import { Faq } from '../shared/faq.model';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  providers: [CatagoryService,FaqService]
})

export class CategoriesComponent implements OnInit {
 
  constructor(public CatagorysService: CatagoryService,
     public faqService: FaqService,
     public notificationService: NotificationService,
     private dialog: MatDialog,
     private dialogService: DialogService) { }

  catagories: Catagory[];
  catagory : Catagory;
  faqs: Faq[];
  faq : Faq;

  searchValue : string;
  p: number = 1;
  public maxSize: number = 5;

  ngOnInit(): void {
       this.getCatagories();
       this.getFaqs_count();
  }
  
  private  getCatagories(){
    this.CatagorysService.getCatagories()
      .subscribe((catagories:any) => 
          {
            this.catagories = catagories
          })
  }
  
  private  getFaqs_count(){
    this.faqService.getFaqs()
      .subscribe((faqs:any) =>
      { 
          this.faqs = faqs
          for(let eachCatagory of this.catagories){
            let count = 0;
            for(let eachFaq of this.faqs){
              if(eachCatagory.catagoryField === eachFaq.catagoryName){    
                       count++; 
              }
            }
            eachCatagory.faq_count = count;
          }
          
      })
  }
  
  _id             : string;
  catagoryField   : string;
  faq_count       : number;

  addCatagoryPopUp(){
  
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    const dialogRef = this.dialog.open(AddCatagoryComponent,dialogConfig);

    dialogRef.afterClosed().subscribe( result => {
      this.CatagorysService.refreshNeeded$
        .subscribe(() => {
           this.getCatagories();
           this.getFaqs_count();
      });

      this.getCatagories();
      this.getFaqs_count();
    });

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
                     this.getFaqs_count();
             });
   
             this.getCatagories();
             this.getFaqs_count();
             this.notificationService.warn('! Deleted Successfully');
            
           }
       })
  }
}
