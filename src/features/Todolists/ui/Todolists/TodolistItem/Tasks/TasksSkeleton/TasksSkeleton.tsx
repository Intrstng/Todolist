import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"
import {SKELETON_GALLERY} from "@/common/constants";

export const TasksSkeleton = () => (
    <Box style={{ padding: "0.5rem 0" }}>
        {Array(SKELETON_GALLERY)
            .fill(null)
            .map((_, id) => (
                <Box key={id}>
                    <Box style={{ gap: "1rem" }}>
                        <Skeleton width={20} height={40} />
                        <Skeleton width={150} height={40} />
                    </Box>
                    <Skeleton width={20} height={40} />
                </Box>
            ))}
    </Box>
)