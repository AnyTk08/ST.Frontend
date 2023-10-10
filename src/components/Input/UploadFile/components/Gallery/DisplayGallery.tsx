import Grid from "@mui/material/Grid";
import ItemCard from "./ItemCard";
import useMediaQuery from '@mui/material/useMediaQuery';

const DisplayGallery = (props: any) => {
  const matches440 = useMediaQuery('(min-width:440px)');
  const { IsopenPopUp, setIsopenPopUp, sPopup,arrFile } = props;


  return (
    <>
      <Grid container spacing={1} justifyContent="flex-start" alignItems="center">
        {arrFile && arrFile.length > 0
          ?
          <>
            {
              arrFile.map((item, idx) => {
                let sKEY = `glr-${idx}`;
                return (
                  <Grid key={sKEY} item xs={matches440 ? 6 : 12} sm={4} md={3} lg={2}>
                    <ItemCard
                      dtRow = {item}
                      arrFile={arrFile}
                      SetarrFile={props.SetarrFile}
                      sFileName={item.sFileName}
                      sFileType={item.sFileType}
                      sCropFileLink={item.sCropFileLink}
                      IsCompleted={item.IsCompleted}
                      IsProgress={item.IsProgress}
                      sProgress={item.sProgress}
                      nFile_ID={item.nFile_ID}
                      sDescription={item.sDescription}
                      // sUrl={item.sUrl}
                      sFileLink={item.sFileLink}
                      disabled={props.disabled}
                      onDelete={props.onDelete}
                      onOpenFile={props.onOpenFile}
                      IsopenPopUp={IsopenPopUp}
                      setIsopenPopUp={setIsopenPopUp}
                      sPopup={sPopup}
                    />
                  </Grid>
                )
              })
            }
          </>
          :
          null
        }
      </Grid>
    </>
  );
};
export default DisplayGallery;
