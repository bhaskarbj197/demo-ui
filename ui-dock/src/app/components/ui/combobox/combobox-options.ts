import { Sizes } from './combobox.component';
import { EventEmitter } from 'protractor';

export interface ComboboxOptions {
   ctrlId: string;
   label: string;
   list: Array<object>;
   key: string;
   value: string;
   model: string;
   
//    isValid: boolean;
//    errorMessageType: string;
//    isSubmit: boolean;
   markedText?: string;
   size?: Sizes;
   isHide?: boolean;
   isDisabled?: boolean;
   isRequired?: boolean;
   backLabel?: string;
   backLabelIcon?: string;
   isBackLabelInfoOnly?: boolean;
   placeholder?: string;
   minLabelLen?: string;
   fixedLen?: string;
   markedKeyList?: Array<string>;
   isNoBorder?: boolean;
   itemDisabledKey?: string;
   keyInNumber?: boolean;
   backLabelMinLabelLen?: string;
   isFloatRight?: boolean;
}
