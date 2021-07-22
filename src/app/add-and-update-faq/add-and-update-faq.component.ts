import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NotificationService } from '../shared/notification.service';
import { CatagoryService } from '../shared/catagory.service';
import { FaqService } from '../shared/faq.service';
import { Catagory } from '../shared/catagory.model';
import { Faq } from '../shared/faq.model';

@Component({
  selector: 'app-add-and-update-faq',
  templateUrl: './add-and-update-faq.component.html',
  styleUrls: ['./add-and-update-faq.component.css'],
  providers:[CatagoryService,FaqService]
})


export class AddAndUpdateFaqComponent implements OnInit {

  urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  faqForm = new FormGroup({
     _id                 : new FormControl(''),
     quesFormControl     : new FormControl('', [Validators.required]),
     ansFormControl      : new FormControl('', [Validators.required]),
     catagoryFormControl : new FormControl( 0, [Validators.required]),
     linkFormControl     : new FormControl('', [Validators.pattern(this.urlPattern)]),
     status              : new FormControl()
  })
 
  constructor(public catagoryService: CatagoryService,
    public faqService  : FaqService,
    public notificationService: NotificationService,
    public dialogRef: MatDialogRef<AddAndUpdateFaqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Faq) { }


  catagories :  Catagory[];
  catagory   :  Catagory;
  ckeConfig: any;

  ngOnInit(): void {  
     this.getCatagories();
     this.ckeConfig = {    
      allowedContent: true,
      extraPlugins: ['divarea','placeholder'],    
      forcePasteAsPlainText: false    
    };  
  }


  faqs : Faq[] = [];
  faq  : Faq;

  _id           : string;
  question      : string;
  description   : any;
  catagoryName  : string;
  link          : string;
  status        : Boolean;
  
  onClose() {
    this.dialogRef.close();
  }
  
  onReset() {
    this.faqForm.reset();
  }

  onSave(){

      if(this.faqForm.valid){
              
        for(let catagory of this.catagories){
          if(catagory._id === this.catagoryName){
             this.catagoryName = catagory.catagoryField;
          }
        }
        if(this._id == undefined){
          
          const newFaq = {

                 _id           : this._id,
                 question      : this.question,
                 description   : this.description,
                 catagoryName  : this.catagoryName,
                 link          : this.link,
                 Date          : Date.now(),
                 status        : true
          } 
          this.faqService.addFaq(newFaq)
            .subscribe((faq:any) => {
              this.notificationService.success(':: Submitted successfully');
               this.onClose();
            },(err)=>{
                this.notificationService.warn('!Something went wrong');
            });
        }
      
        else{

          const updatedFaq = {
            _id           : this._id,
            question      : this.question,
            description   : this.description,
            catagoryName  : this.catagoryName,
            link          : this.link,
            Date          : Date.now(),
            status        : this.status
          }
          this.faqService.updateFaq(updatedFaq)
          .subscribe(()=>{
             this.notificationService.success(':: Updated successfully');
             this.onClose();
          },(err)=>{
             this.notificationService.warn('!Something went wrong');
          });

        }
        /*
        let count = 0;
        for(let eachCatagory of this.catagories){
           
            if(this.catagoryName === eachCatagory.catagoryField){
              
              const updatedCatagory = {
                _id                : eachCatagory._id,
                catagoryField      : eachCatagory.catagoryField,
                Date               : eachCatagory.Date,
                faq_count          : eachCatagory.faq_count+1
              }
                  console.log(updatedCatagory);
                  this.catagoryService.updateCatagory(updatedCatagory)
                  .subscribe(()=>{
                    console.log(eachCatagory.faq_count)
                  })
                  break;
            }
        }*/
            
      }
  }
  
  private  getCatagories(){
    
    this.catagoryService.getCatagories()
      .subscribe((catagories:any) => 
        {
              this.catagories = catagories
              
              this._id = this.data._id;
              this.question = this.data.question;
              this.description = this.data.description;
              for(let catagory of this.catagories){
                if(catagory.catagoryField === this.data.catagoryName){
                    this.catagoryName = (catagory._id).toString();
                }
              }
              this.link   = this.data.link;
              this.status = this.data.status
              
        })
  }

}
