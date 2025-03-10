import { Height } from "@mui/icons-material";
import "./Block.css"
import Card from '@mui/material/Card';
import { Box } from "@mui/system";

export default function Block({ blockName, children })
{
    return(
        <Card sx={{ height: "42.5vh" }}>
            <div style={{height: "10%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
            ><h3>{blockName}</h3></div>
            <div style={{height: "80%", padding: "1vh"}}>{children}</div>
        </Card>
    );
}