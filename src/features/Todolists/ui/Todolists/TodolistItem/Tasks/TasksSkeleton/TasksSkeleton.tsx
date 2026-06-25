import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import {SKELETON_GALLERY} from "@/common/constants";

export const TasksSkeleton = () => (
    <Box style={{ padding: "0.5rem 0" }}>
        {Array(SKELETON_GALLERY)
            .fill(null)
            .map((_, id) => (
                <Box key={id}>
                    <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Skeleton width={155} height={60} />
                        <Skeleton width={95} height={65} />
                    </Box>
                </Box>
            ))}
    </Box>
)