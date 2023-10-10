import { Fragment, useCallback, useState } from "react";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import FilePopup from "../PopUp/FilePopup";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { BsFillFileEarmarkWordFill } from "react-icons/bs";
import { SiMicrosoftexcel, SiMicrosoftpowerpoint } from "react-icons/si";
import { Extension, OpenNewTab } from "utilities/ST_Function";
import { BtnDeleteOnTable } from "components/Button";
import { Checkbox } from "@mui/material";
import { downloadFile } from "../../UploadFile";
import No_BG from "assets/images/NoImage/no-image-available.png";

const ItemRow = (props) => {
	const {
		IsCrop,
		cropShape,
		cropRatio,
		cropResize,
		cropMovable,
		IsHide = false,
	} = props;

	const {
		IsMultiDelete,
		disabled,
		IsHiddenUploadBox,
		SendCropImage,
		handleClick,
		isSelected,
		sPopup,
	} = props;

	const [IsopenPopUp, setIsopenPopUp] = useState(false);

	const ClosePopUp = () => {
		setIsopenPopUp(false);
	};
	const OpenPopUp = useCallback(() => {
		setIsopenPopUp(true);
		if (props.onOpenFile) {
			props.onOpenFile(props.nFile_ID);
		}
	}, [props]);



	const onDownload = () => {
        downloadFile(props.sCropFileLink, props.sFileName)
    };

	const onClickFile = () => {
		if (sPopup === "newtab") {
			OpenNewTab(props.sCropFileLink);
		} else {
			if (props.onOpenFile) {
				props.onOpenFile(props.nFile_ID);
			}
			let isCheck =
				Extension.Image.indexOf(props.sFileType.toLowerCase()) > -1 ||
				Extension.Video.indexOf(props.sFileType.toLowerCase()) > -1 
			isCheck ? OpenPopUp() : onDownload();
		}
	};

	return (
		<Fragment>
			<Grid
				container
				justifyContent="flex-start"
				alignItems="center"
				spacing={0.5}
				className={"mui-style-FileItem"}
				sx={{ position: "relative", paddingBottom: IsHide ? "10px" : "0" }}
			>
				{!IsHide && (
					<>
						{IsMultiDelete ? (
							<Grid item>
								{props.IsCompleted &&
									!disabled &&
									!IsHiddenUploadBox ? (
									<Checkbox
										color="primary"
										checked={isSelected(props.nFile_ID)}
										onClick={(event) => {
											handleClick(props.nFile_ID);
										}}
									/>
								) : null}
							</Grid>
						) : (
							<Grid item>
								{props.IsCompleted &&
									!props.disabled &&
									!props.IsHiddenUploadBox ? (
									<BtnDeleteOnTable
										id={`delete-ontable-${props.nFile_ID}`}
										onClick={() => {
											props.onDelete(props.nFile_ID);
										}}
									/>
								) : (
									<></>
								)}
							</Grid>
						)}
					</>
				)}
				<Grid item className={"mui-style-ColumnThumbnail"}>
					{DisplaySubFile(props, onClickFile)}
				</Grid>
				<Grid
					item
					xs
					className={"mui-style-ColumnTitle"}
					onClick={onClickFile}
				>
					<Typography className={"mui-style-Title"}>
						{props.sFileName}
					</Typography>
				</Grid>
				{!IsHide && (
					<>
						{props.sProgress === "100" ? (
							<Grid item>
								{/* <CheckCircleIcon className="icon-pass" /> */}
							</Grid>
						) : (
							<Grid item xs={12}>
								<Box
									display="flex"
									alignItems="center"
									style={{
										display:
											props.IsHiddenUploadBox &&
												(props.sProgress === "100" ||
													props.sProgress === undefined)
												? "none"
												: "block",
									}}
								>
									<Box width="100%" mr={1}>
										<LinearProgress
											variant="determinate"
											value={
												parseInt(props.sProgress) || 100
											}
										/>
									</Box>
									<Box minWidth={40}>
										<Typography
											variant="body2"
											color="textSecondary"
										>
											{props.sProgress ? props.sProgress + "%" : props.IsCompleted ? "100%" : ""}
										</Typography>
									</Box>
								</Box>
							</Grid>
						)}
					</>
				)}
			</Grid>
			<FilePopup
				file={props}
				IsopenPopUp={IsopenPopUp}
				ClosePopUp={ClosePopUp}
				IsCrop={IsCrop}
				cropShape={cropShape}
				cropRatio={cropRatio}
				cropResize={cropResize}
				cropMovable={cropMovable}
				SendCropImage={SendCropImage}
				setStartVideoOn={props.setStartVideoOn}
				nStartVideoOn={props.nStartVideoOn}
				CannotSkipForward={props.CannotSkipForward}
				onVideoEnd={props.onVideoEnd}
				onDelete={props.onDelete}
				sPopup={sPopup}
			/>
		</Fragment>
	);
};

export default ItemRow;

function DisplaySubFile(props: any, onClickFile: () => void) {

	const onImageError = (e) => {
        e.target.src = No_BG;
    }


	return (
		<>
			{Extension.Image.indexOf(props.sFileType.toLowerCase()) > -1 ?
				<Fragment>
					<img
						src={
							props.sCropFileLink && props.sCropFileLink.search("http") > -1
								? props.sCropFileLink
								: process.env.REACT_APP_API_URL +
								props.sCropFileLink || ""
						}
						alt=""
						width={34}
						height={34}
						className="img-shadow"
						onError={onImageError}
						style={{ borderRadius: "50%", margin: "8px" }}
					/>
				</Fragment>
				: null}

			{Extension.Video.indexOf(props.sFileType.toLowerCase()) > -1 ? (
				<Tooltip title="">
					<IconButton
						className={"mui-style-WordColor"}
						size="small"
						onClick={onClickFile}
					>
						<VideoLibraryIcon className={"mui-style-IConColor"} />
					</IconButton>
				</Tooltip>
			) : null}

			{Extension.PDF.indexOf(props.sFileType.toLowerCase()) > -1 ?
				<Tooltip title="">
					<IconButton
						className={"mui-style-PDFColor"}
						size="small"
						onClick={onClickFile}
					>
						<PictureAsPdfIcon className={"mui-style-IConColor"} />
					</IconButton>
				</Tooltip>
				: null}

			{Extension.Word.indexOf(props.sFileType.toLowerCase()) > -1 ?
				<Tooltip title="">
					<IconButton
						className={"mui-style-WordColor"}
						size="small"
						onClick={onClickFile}
					>
						<BsFillFileEarmarkWordFill
							className={"mui-style-IConColor"}
						/>
					</IconButton>
				</Tooltip>
				: null}

			{Extension.Excel.indexOf(props.sFileType.toLowerCase()) > -1 ?
				<Tooltip title="">
					<IconButton
						className={"mui-style-ExcelColor"}
						size="small"
						onClick={onClickFile}
					>
						<SiMicrosoftexcel className={"mui-style-IConColor"} />
					</IconButton>
				</Tooltip>
				: null}

			{Extension.PowerPoint.indexOf(props.sFileType.toLowerCase()) > -1 ?
				<Tooltip title="">
					<IconButton
						className={"mui-style-PowerPointColor"}
						size="small"
						onClick={onClickFile}
					>
						<SiMicrosoftpowerpoint className={"mui-style-IConColor"} />
					</IconButton>
				</Tooltip>
				: null}
		</>
	);
}
