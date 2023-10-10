import SubNavLv1 from "./SubNavLv1"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

//Styled
import { SidebarNav, WrapImageProfile, WrapUserContent, WrapUserIcon } from "./Styled_Sidebar"

export interface IdataMenuType {
    nMenuID?: number;
    sMenuNameTH?: string;
    sMenuNameENG?: string;
    sIcon: string;
    IsActive?: true;
    IsView?: true;
    sMenuLink?: string;
    lstSubMenu?: any;
}

type SideBarMenuProps = {
    fnShowSidebar?: VoidFunction | null;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    sidebar?: boolean;
    dataMenu?: IdataMenuType[];
    loading?: boolean;
    userName?: string;
    userProfileImg?: string;
    sDefaultRole?: string;
    sAllRole?: string;
    sID?: string;
    sLink?: string;
    sName?: string;
};

const SidebarStaticDropDown: React.FC<SideBarMenuProps> = ({
    sidebar,
    dataMenu,
    fnShowSidebar,
    loading,
    userName,
    userProfileImg,
    sDefaultRole,
    sAllRole
}) => {


    return (
        <SidebarNav sidebar={sidebar ? 1 : 0}>
            <WrapUserIcon sidebar={sidebar ? 1 : 0}>
                <WrapImageProfile bgimg={userProfileImg} />
                <WrapUserContent>
                    <div>{userName}</div>
                </WrapUserContent>
            </WrapUserIcon>
            {
                loading ?
                    <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                        <CircularProgress />
                    </Box>
                    :
                    dataMenu && dataMenu.map((item) => {
                        return (
                            <SubNavLv1 key={item.nMenuID} dataMenu={item} sidebar={sidebar} fnShowSidebar={fnShowSidebar} />
                        );
                    })
            }
        </SidebarNav>
    );
};

export default SidebarStaticDropDown;
