import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';

import { AddAndUpdateFaqComponent } from '../add-and-update-faq/add-and-update-faq.component';
import { NotificationService } from '../shared/notification.service';
import { FaqService } from '../shared/faq.service';
import { Faq } from '../shared/faq.model';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css'],
  providers: [FaqService]
})
export class FaqsComponent implements OnInit {

  constructor(public faqService: FaqService,
    public notificationService: NotificationService,
    private dialog: MatDialog,
    private dialogService: DialogService) { }

  ngOnInit(): void {

    this.getFaqs();

  }
   
  faqs : Faq[];
  faq  : Faq;
  searchValue : string;
  p: number = 1;
  public maxSize: number = 5;

  _id           : string;
  question      : string;
  description   : string;
  catagoryName  : string;
  link          : string;
  status        : string;

  addFaqPopUp(){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(AddAndUpdateFaqComponent,dialogConfig);

    dialogRef.afterClosed().subscribe( result => {
      this.faqService.refreshNeeded$
        .subscribe(() => {
           this.getFaqs();
      });

      this.getFaqs();
    });

  }

  onUpdate(faq:any){

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.data = faq;
    const dialogRef = this.dialog.open(AddAndUpdateFaqComponent,dialogConfig);

    dialogRef.afterClosed().subscribe( result => {
      this.faqService.refreshNeeded$
        .subscribe(() => {
             this.getFaqs();
        });

      this.getFaqs();
    });
  }

  deleteFaq(id:any){
     
    var faqs = this.faqs;
     this.dialogService.openConfirmDialog('Are you sure to delete this Faq?')
        .afterClosed().subscribe(res=>{
            if(res){
              this.faqService.deleteFaq(id)
              .subscribe(data => {
                    if(data.n == 1)
                    {
                      for(var i=0;i<faqs.length;i++)
                      {
                        if(faqs[i]._id == id)
                        {
                          faqs.splice(i,1);
                        }
                      }
                    }
              })
    
              this.faqService.refreshNeeded$
                 .subscribe(() => {
                      this.getFaqs();
              });
    
              this.getFaqs();
              this.notificationService.warn('! Deleted Successfully');
             
            }
        })

  }

  onDeactivate(faq:any){
    this.dialogService.openConfirmDialog('Are you sure to Deactivate this Faq?')
      .afterClosed().subscribe(res=>{
          if(res){
               const statusChange ={
                  _id             : faq._id,
                  status          : false
                }

                this.faqService.updateFaq(statusChange)
                .subscribe(()=>{
                  this.faqService.refreshNeeded$
                  .subscribe(() => {
                       this.getFaqs();
                });
     
               this.getFaqs();
               
               this.notificationService.warn(':: Deactivated successfully');
                },(err)=>{
                 this.notificationService.warn('!Something went wrong');
               });
          }
      })
        
  }

  onActivate(faq:any){
    this.dialogService.openConfirmDialog('Are you sure to Activate this Faq?')
    .afterClosed().subscribe(res=>{
        if(res){
              const statusChange = {
                _id             : faq._id,
                Date            : Date.now(),
                status          : true
              }

              this.faqService.updateFaq(statusChange)
              .subscribe(()=>{
                this.faqService.refreshNeeded$
                .subscribe(() => {
                     this.getFaqs();
              });
   
             this.getFaqs();
             
             this.notificationService.success(':: Activated successfully');
              },(err)=>{
               this.notificationService.warn('!Something went wrong');
             });
        }
    })
  }

  private  getFaqs(){
    this.faqService.getFaqs()
      .subscribe((faqs:any) => 
          this.faqs = faqs)
   /*
   this.faqService.getFaqs()
       .subscribe((faq:any) => 
           this.tempArr = faq)*/
  }

  
}
