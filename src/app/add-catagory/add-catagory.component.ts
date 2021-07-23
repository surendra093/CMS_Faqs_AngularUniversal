import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl,Validators,FormGroupDirective,NgForm } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { NotificationService } from '../shared/notification.service';
import { CatagoryService } from '../shared/catagory.service';
import { Catagory } from '../shared/catagory.model';

// define custom ErrorStateMatcher
export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl, form: NgForm | FormGroupDirective | null) {
      return control && control.invalid && control.touched;
    }
}

@Component({
    selector: 'app-add-catagory',
    templateUrl: './add-catagory.component.html',
    styleUrls: ['./add-catagory.component.css'],
    providers:[CatagoryService]
})
  
export class AddCatagoryComponent implements OnInit {
    
    catagoryForm = new FormGroup({
        _id  : new FormControl(''),
        catagoryFormControl : new FormControl('', [Validators.required])
     })

    // create instance of custom ErrorStateMatcher
    errorMatcher = new CustomErrorStateMatcher();

     constructor(public CatagorysService: CatagoryService,
        public notificationService: NotificationService,
        public dialogRef: MatDialogRef<AddCatagoryComponent>) { }

    ngOnInit(): void {  
       
    }

    catagories: Catagory[] = [];
    catagory : Catagory;

    _id             : string;
    catagoryField   : string;
    faq_count       : number;

    onClose() {
        this.dialogRef.close();
    }


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
                this.onClose();
            },(err)=>{
                this.notificationService.warn('!Something went wrong');
            });

        }  
    }
}