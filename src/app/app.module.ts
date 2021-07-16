import { NgModule } from '@angular/core';
import { BrowserModule,Title} from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ng2-ckeditor';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './categories/categories.component';
import { FaqsComponent } from './faqs/faqs.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { CatagoryService } from './shared/catagory.service';
import { FaqService } from './shared/faq.service';
import { CatagorySearchfilterPipe } from './catagorySearchfilter.pipe';
import { FaqSearchfilterPipe } from './faqSearchfilter.pipe';
import { SafeHtml } from './safeHtml.pipe';
import { AddAndUpdateFaqComponent } from './add-and-update-faq/add-and-update-faq.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    FaqsComponent,
    CatagorySearchfilterPipe,
    FaqSearchfilterPipe,
    SafeHtml,
    AddAndUpdateFaqComponent,
    MatConfirmDialogComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    CKEditorModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [Title,CatagoryService,FaqService],
  bootstrap: [AppComponent],
  entryComponents: [AddAndUpdateFaqComponent,MatConfirmDialogComponent]
})
export class AppModule { }

