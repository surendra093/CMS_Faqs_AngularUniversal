import { Faq } from './shared/faq.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class FaqSearchfilterPipe implements PipeTransform {

  transform(faqs:Faq[],searchValue: string): Faq[] {
       if(!faqs || !searchValue){
           return faqs;
       }
      
       return faqs.filter(faq =>
        faq.question.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
  }

}
