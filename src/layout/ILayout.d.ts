export interface IlstMenu {
  lstMenu: LstMenu[]
  Status: number
  Message: string
}

export interface LstMenu {
  sKey: string
  sMenuID: string
  sMenuName: string
  sURL: string
  sIcon: string
  nLevel: number
  IsDisplay: boolean
  lstChildren: LstChildren[]
}

export interface LstChildren {
  sKey: string
  sMenuID: string
  sMenuName: string
  sURL: string
  sIcon: string
  nLevel: number
  IsDisplay: boolean
  lstChildren: any[]
}
