import { styled } from "@mui/system";

type styledProps = {
    sidebar?: boolean | number;
    color?: string;
    bgimg?: string;
    activeurl?: boolean | number;
    subnav?: boolean | number;
};

export const WrapUserIcon = styled("div")<styledProps>(({ sidebar, theme }) => ({
    minHeight: "200px",
    height: "200px",
    width: "100%",

    display: sidebar ? "none" : "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
        "linear-gradient(135deg, rgba(163, 209, 255, 1) 0%, rgba(49, 0, 71, 0.18) 100%)",

    // background-image: linear-gradient(135deg, rgba(25, 136, 247, 1) 0%, rgba(247, 25, 136, 1) 100%);
    // [theme.breakpoints.down('sm')]: {
    //     display: "none",
    // },
}));

export const WrapImage = styled("img")({
    // maxHeight: "200px",
    height: "70px",
    width: "70px",
    borderRadius: "50%",
});

export const WrapImageProfile = styled("div")<styledProps>(({ bgimg }) => ({
    // maxHeight: "200px",
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    backgroundImage: bgimg ? `url('${bgimg}')` : null,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
}));

export const WrapUserContent = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "5px",
    fontWeight: "bold",
    width: '100%'
});

export const SidebarNav = styled("nav")<styledProps>(({ sidebar, theme }) => ({
    color: "#1b1464",
    backgroundColor: "white",
    minWidth: sidebar ? "60px" : "250px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 4px 8px 0 rgba(0, 0, 0, 0.2)",
    zIndex: "10",

    [theme.breakpoints.down("sm")]: {
        // height: "100%",
        position: "absolute",
        left: sidebar ? "-100px" : "0",
    }

}));

export const SidebarWrap = styled("div")<styledProps>(({ activeurl }) => ({
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    transition: "background 350ms ease-out,",
    fontSize: "14px",
    borderRadius: "10px",
    color: activeurl ? "#ffffff" : "#000000",
    background: (activeurl ? "#5598fc" : ""),

    "&:hover": {
        color: "#000000",
        background: "#5598fc",
        // borderRight: "6px solid #1E90FF",
        cursor: "pointer",
    },
}));


export const SidebarLabel = styled("span")<styledProps>(({ sidebar }) => ({
    display: sidebar ? "none" : "block",
    width: "100%",
    transition: "350ms",
}));

export const WrapMenuContent = styled("div")<styledProps>(({ subnav }) => ({
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    // fontWeight:"bold"
    "& .rotate-Icon": {
        transform: subnav ? "rotate(-180deg)" : "",
    },
}));

export const WrapIconMUI = styled("div")({
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    "& >.MuiSvgIcon-root": {
        fontSize: "33px"
    },
    "&:hover": {
        "& >.MuiAvatar-root": {
            backgroundColor: "#1e90ff"
        }
    },

});

export const WrapSubIconMUI = styled("div")({
    // paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    // "& >.MuiSvgIcon-root": {
    //     fontSize: "16px"
    // }
});

export const WrapItemSubNav = styled("div")<styledProps>(({ activeurl }) => ({
    height: "46px",
    width: "100%",
    display: "flex",
    // justifyContent:"space-between",
    // backgroundColor: "#ebffed",
    alignItems: "center",
    // paddingLeft: "1rem",
    textDecoration: "none",
    // color: "#1b1464",
    color: activeurl ? "#ffffff" : "#000000",
    borderRadius: "10px",
    background: (activeurl ? "#5598fc" : ""),

    "&:hover": {
        color: "#000000",
        background: "#5598fc",
        // borderRight: "6px solid #1E90FF",
        cursor: "pointer",
    },
}));