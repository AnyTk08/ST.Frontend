import { Breadcrumbs, Grid, Link, Typography, styled } from "@mui/material";
import Appbar from "layout/LayoutFront/components/Appbar";
import MainBG from "../../assets/images/Background/MainBG.png";
import SideMenu from "layout/LayoutFront/components/SideMenu";
import "../styleComponentLayout.css";
import { IlstMenu } from "layout/ILayout";
import { useEffect, useState } from "react";
import { AxiosGet } from "utilities/ST_Axios";
import { BreadcrumbItemData } from "components/Breadcrumbs/BreadcrumbsBar";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthToken } from "config/AxiosConfig";

const ContainerBG = styled("div")({
	background: `url(${MainBG}) no-repeat center center fixed`,
	WebkitBackgroundSize: "cover",
	MozBackgroundSize: "cover",
	OBackgroundSize: "cover",
	backgroundSize: "cover",
	height: "100vh",
	width: "100%",
	position: "fixed",
	overflowY: "auto",
});

type Props = {
	children?: React.ReactNode;
	propLayout?: any;
};

const LayoutFront: React.FC<Props> = ({ children, propLayout }) => {
	const [dataMenu, setDataMenu] = useState<IlstMenu[]>([]);
	const [arrBreadCrumb, setArrBreadCrumb] = useState<Array<BreadcrumbItemData>>([]);
	const [IsDiv, SetIsDiv] = useState<boolean>(false);

	//#region Login AD
	const location = useLocation();
	useEffect(() => {
		const queryString = location.search;
		const urlParams = new URLSearchParams(queryString);
		const token = urlParams.get("token");
		console.log("Token AD : ", token);  
		if (token != null && token != "") {
			onAutoLoginAD(token)
		}    
    }, [location.search])    

    const onAutoLoginAD = (sToken) => {
        console.log("Result AD : ", sToken);
        if (sToken) {
            AuthToken.set(sToken);
            window.location.href = `${process.env.REACT_APP_URL}` + "homebanner";
        }
    }    
    //#endregion

	useEffect(() => {
        let auth_token = localStorage.getItem(`${process.env.REACT_APP_JWT_KEY}`) + "";
		if(auth_token){
			GetMenuSystem();
		}
    }, [])

	useEffect(() => {
		GetBreadCrumb();

		let sPathName = window.location.pathname;	
		if ((sPathName === "/search" || sPathName === "/PTT-CRSR/search") || (sPathName === "/homebanner" || sPathName === "/PTT-CRSR/homebanner")) {
			SetIsDiv(true);
		} else {
			SetIsDiv(false);
		}
	}, [window.location.pathname]);

	const GetMenuSystem = () => {
		AxiosGet("APISystems/GetMenuSystem", { IsFront: true }, (Result) => {
			setDataMenu(Result.lstMenu ?? []);
		});
	};

	const navigate = useNavigate();
	const GetBreadCrumb = () => {
		let sRoute = window.location.pathname
			.replace("/", "")
			.toLocaleLowerCase();
		let arrBreadCrumb: Array<BreadcrumbItemData> = [];

		AxiosGet(
			"APISystems/GetBreadCrumbFront",
			{ sRoute: sRoute },
			(Result) => {
				let lstBremcrumb = Result.lstBremcrumb;
				if (lstBremcrumb) {
					lstBremcrumb.forEach((Item) => {
						if (Item.ItemName) {
							let sItemRoute = Item.sURL?.toLocaleLowerCase();
							arrBreadCrumb.push({
								Key: Item.Key,
								sIcon: Item.sIcon,
								ItemName: Item.ItemName,
								IsOnClick: !(
									sItemRoute !== sRoute && sItemRoute !== ""
								),
								Href: Item.sURL,
							});
						}
					});
					setArrBreadCrumb(arrBreadCrumb);
				} else {
					arrBreadCrumb.push({
						Key: "",
						sIcon: "",
						ItemName: "",
						IsOnClick: false,
						Href: "",
					});
					setArrBreadCrumb(arrBreadCrumb);
				}
			}
		);
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				minHeight: "100vh",
				position: "relative",
			}}
		>
			<ContainerBG>
				<Grid
					container
					spacing={0}
					justifyContent={"center"}
					alignItems={"start"}
				>
					<Grid item>
						<Appbar dataMenu={dataMenu} />
					</Grid>

					<Grid item xs={12}>
						<div
							className="padding-content-layout"
							style={{ minHeight: "85vh" }}
						>
							{arrBreadCrumb.length > 0 && (
								<Grid
									item
									xs={12}
									style={{ marginBottom: "10px" }}
									className="box-breadcrumb"
								>
									<Breadcrumbs
										className="breadcrumb-front"
										separator="|"
										aria-label="breadcrumb"
									>
										{arrBreadCrumb.map((m, i) =>
											m.IsOnClick ? (
												<Link
													key={
														"BreadcrumbAuto_" +
														m.Key
													}
													underline="hover"
													color="inherit"
													onClick={() => {
														let Href =
															m.Href.length > 1
																? "/" + m.Href
																: "/";
														navigate(Href);
													}}
													sx={{
														display: "flex",
														alignItems: "center",
														cursor: "pointer",
													}}
												>
													{m.ItemName}
												</Link>
											) : (
												<Typography
													sx={{
														fontSize:
															"1.75rem !important",
													}}
													color={
														i ===
														arrBreadCrumb.length - 1
															? "#00448a"
															: "#005ab7"
													}
													key={
														"BreadcrumbAuto_" +
														m.Key
													}
												>
													{m.ItemName}
												</Typography>
											)
										)}
									</Breadcrumbs>
								</Grid>
							)}

							<div className={IsDiv ? "" : "div-glass-child"}>{children}</div>
						</div>
					</Grid>
				</Grid>
			</ContainerBG>
			<SideMenu dataMenu={dataMenu} />
		</div>
	);
};
export default LayoutFront;
