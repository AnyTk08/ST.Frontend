interface AutocompleteProp {
   id:string;
   name: string;
   label: string;
   placeholder?: string;
   /**
      * ส่งข้อมูลกลับ ตอนเลือก 
      */
   onSelect?: (e: any, Value: any) => void;
   /**
      * ฟังก์ชั่น สำหรับทำการ Load ข้อมูล จะส่ง Text Filter และ loaded  แบบนี้ไปให้ fnLoadData(inputValue_, setloaded);
      * ตัวอย่าง เช่น
      * <AutocompleteForm
      *      name="sUser" 
      *      label="test" 
      *      required={true} 
      *      fnLoadData={(v,setloaded) => 
      *          {
      *              setloaded(true);
      *              // Call API
      *              let lst = [{ label:"00215 =ชัยณรงค์ ทองบัว", value:"00215"  }];
      *              setloaded(false);
      *              return lst;
      *           }}
      * />
      * 
      * สิ่งสำคัญที่ต้องส่งมาคือ ใน List ต้องประกอบด้วย label,value ที่เหลือแล้วแต่จุดประสง
      */
   fnLoadData: (a,b) => any;
   /**
      * จำนวน เท่าไร ถึงจะเข้า fnLoadData() //จำนวณที่จะเริ่มค้นหา
      * default 1
      */
   TextFilterCount?: number;
   disabled?: boolean;
   fullWidth?: boolean;
   isClearable?: boolean;
   onClear?: any;
   isMessageError?: boolean;
   style?: React.CSSProperties;
   inputPropsStyle?: React.CSSProperties;
   startAdornment?: any;
   isPopperCustom?: boolean;
   nLimits?: number;
   IsShrink?: boolean;
}   

export interface AutocompleteFormProp extends AutocompleteProp { 
   required: boolean; 
}

export interface AutocompleteNoFormProp extends AutocompleteProp { 
   value?: string;  
   ShowLabel?: string;
   IsClearList?: boolean;
}


interface optionsProps { value: any, label: any, }

interface AsyncAutoCompleteProps {
   id?:string;
   name: string;
   label?: string;
   placeholder?: string;
   fullWidth?: boolean; 
   style?: React.CSSProperties;
   inputPropsStyle?: React.CSSProperties;
   disabled?: boolean;
   isClearable?: boolean;
   limitTag?: number; //จำนวณที่จะแสดง Tag
   TextFilterCont?: number; //จำนวณที่จะเริ่มค้นหา
   isMessageError?: boolean;
   startAdornment?: any;
   sUrlAPI?: string;
   sParam?: string; //{ "strSearch": sSearch, "sParam": sParam } การส่งค่าแบบตัวเดียวควรใช้ sParam
   ParamUrl?: any; //{ "strSearch": sSearch, "sDate": sDate, "nValue": nValue, "sName": sName } การส่งค่าแบบหลายๆตัวควรใช้ ParamUrl
   sMethodAxios?: string; //("POST" / "GET") default "GET"
   onChange?: any;
   onBlur?: any;
   isPopperCustom?: boolean;
   IsShrink?: boolean;
} 

export interface AsyncAutoCompleteFormProps extends AsyncAutoCompleteProps { 
   required: boolean; 
}

 export interface AsyncAutoCompleteNoFormProps extends AsyncAutoCompleteProps { 
   value?: any; 
}