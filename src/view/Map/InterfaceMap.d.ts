export interface MapProp {
  id: string;
  mapRef: React.MutableRefObject<any>;
  IsMultiMarker?: boolean;
  Isdisable: boolean;
  IsFullScreen?: boolean;
  IsMarkerSearch?: boolean;
  IsMarker: boolean;
  IsPopUp: boolean;
  IsSearch: boolean;
  nZoom?: number;
  sHeight?: string;
  sSearch?: string;
  latSearch?: string;
  lngSearch?: string;
  //multi
  arrMarker?: any;
  setarrMarker?: any;
  //search
  markerSearch?: any;
  setmarkerSearch?: any;
  formArea?: UseFormReturn<FieldValues, any>;
}
