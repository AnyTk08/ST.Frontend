import { Box, Chip, Grid, Typography } from "@mui/material";
import React from "react";
import { ParseHtml } from "utilities/ST_Function";

function RenderText(props) {
	const {
		header = "",
		text = "",
		lstText = [],
		IsFlex = true,
		IsChip = false,
		IsOrder = false,
		IsList = false,
		IsFlexList = false,
		lstSubtext = [],
		titleText = "",
		IsFlexArray = false,
		columnGap = "0rem",
		fontWeightText = 400,
		endAdornment = "บาท",
		tooltip = null,
		IsFormat = false,
		Icon = null,
		textChip = null,
		key = "",
		color = null
	} = props;
	return (
		<Box key={key} className="render-text-box" sx={IsFlex ? { display: "flex", alignItems: "center" } : {}}>
			<Typography sx={{ fontWeight: 700, mr: 0.5, color: color }}>
				{Icon} {Icon ? " " : null}
				{header}
				{tooltip}
			</Typography>

			{!IsList &&
				(IsChip && text != null && text !== "" ? (
					<>
						<Chip
							key={text}
							sx={{
								backgroundColor: "#171361",
								color: "#fff",
								fontSize: "1rem",
							}}
							size={"small"}
							label={text}
						/>
					</>
				) : (
					<Typography
						sx={
							IsChip && text != null && text !== ""
								? {
									minWidth: "50px",
									backgroundColor: "#171361",
									padding: "0px 10px",
									borderRadius: "1rem",
									color: "#fff",
									marginRight: "0.5rem",
									marginTop: "0.5rem",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									fontSize: "1rem",
									fontWeight: fontWeightText,
									maxWidth: "max-content",
								}
								: { fontWeight: fontWeightText, whiteSpace: "pre-wrap" }
						}
						key={text}
					>
						{text != null && text !== "" ? ParseHtml(text) : "-"}
						{textChip ? " " : null}
						{textChip}
					</Typography>
				))}

			{IsFormat && lstSubtext.length > 0 && lstText != null ? (
				<Grid container spacing={2}>
					<>
						{lstText.map((t, i) => (
							<>
								<Grid item xs={12} md={6}>
									{IsOrder && (
										<Typography sx={{ mr: 0.35 }}>
											{i + 1}.
										</Typography>
									)}
									{ParseHtml(t)}
								</Grid>
								<Grid item xs={12} md={4}>
									{lstSubtext.length > 0
										? " " +
										lstSubtext[i] +
										` ${endAdornment}`
										: ""}
								</Grid>
							</>
						))}
					</>
				</Grid>
			) : (
				<Box
					sx={
						IsChip || IsFlexArray
							? {
								display: "flex",
								columnGap: columnGap,
								flexWrap: "wrap",
							}
							: {}
					}
				>
					{IsList && lstText != null && (
						<>
							{lstText.map((t, i) => (
								<Box
									key={t}
									sx={IsFlexList ? { display: "flex" } : {}}
								>
									{IsOrder && (
										<Typography sx={{ mr: 0.35 }}>
											{i + 1}.
										</Typography>
									)}
									<Typography
										sx={
											IsChip
												? {
													minWidth: "50px",
													backgroundColor:
														"#171361",
													padding: "0px 10px",
													borderRadius: "1rem",
													color: "#fff",
													marginRight: "0.5rem",
													marginTop: "0.5rem",
													// display: "flex",
													// justifyContent:
													// 	"center",
													// alignItems: "center",
													verticalAlign: "center",
													fontSize: "1rem",
													fontWeight:
														fontWeightText,
													maxWidth: "max-content",
													display: "-webkit-box",
													overflow: "hidden",
													WebkitBoxOrient:
														"vertical",
													WebkitLineClamp: 1,
												}
												: {}
										}
									>
										<span
											style={{
												fontWeight: fontWeightText,
											}}
										>
											{" "}
											{titleText !== ""
												? titleText + " "
												: ""}{" "}
											{ParseHtml(t)}{" "}
										</span>
										<span>
											{lstSubtext.length > 0
												? " " +
												lstSubtext[i] +
												` ${endAdornment}`
												: ""}
										</span>
									</Typography>
								</Box>
							))}
						</>
					)}
				</Box>
			)}
		</Box>
	);
}

export default RenderText;
