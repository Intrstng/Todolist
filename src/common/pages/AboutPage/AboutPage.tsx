import {alpha, Box, Chip, Container, Link, List, ListItem, ListItemText, Paper, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router";
import {PATH} from "@/common/constants";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: alpha(theme.palette.primary.light, 0.04),
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4],
    },
}));

const StyledCode = styled('code')(({ theme }) => ({
    backgroundColor: alpha(theme.palette.grey[500], 0.12),
    padding: theme.spacing(0.3, 0.8),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.875rem',
    color: theme.palette.error.main,
    fontFamily: 'monospace',
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    fontWeight: 500,
}));

export const AboutPage = () => {
    const navigate = useNavigate();

    const redirectToAboutPage = () => {
        navigate(PATH.ROOT)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: 'primary.main',
                        fontWeight: 700,
                        borderBottom: 3,
                        borderColor: 'primary.main',
                        pb: 2,
                    }}
                >
                    About TodoList Application
                </Typography>
            </Box>
            <Button onClick={redirectToAboutPage}
                    variant="contained"
                    sx={{
                        // width: {xs: "100%", sm: 200, md: 250},
                        marginBottom: "2rem",
                        alignSelf: "flex-end",
                    }}
            >
                To the main page
            </Button>
            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Overview
                </Typography>
                <Typography variant="body1">
                    The TodoList application represents a comprehensive exploration of modern React development practices,
                    demonstrating the evolution of state management, data handling, and application architecture.</Typography>
                <Typography variant="body1">
                    This application was completely rewritten several times to show each separate approach to the processing of data and storage of data in the REACT application.
                </Typography>
                <Typography variant="body1">
                    To view each individual application implementation that uses a distinct approach, you can switch to the corresponding commit specified in the{' '}
                    <Link
                    href="https://github.com/Intrstng/Todolist"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    README.md
                </Link>
                </Typography>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    State Management Evolution
                </Typography>
                <Typography variant="body1">
                    The application's state management architecture underwent several strategic transformations,
                    each reflecting best practices in the React ecosystem:
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Initial Implementation:</strong> Began with local component state using{' '}
                                    <StyledCode>useState</StyledCode> hooks
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Intermediate Approach:</strong> Transitioned to <StyledCode>useReducer</StyledCode> for more complex state logic
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Redux Integration:</strong> Implemented Redux for global state management
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Thunk Pattern:</strong> Added Redux Thunk middleware for handling asynchronous operations
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Modern Syntax:</strong> Refactored thunks to use <StyledCode>createAsyncThunk</StyledCode> for improved error handling and action lifecycle management
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Redux Toolkit (RTK):</strong> Introduced <StyledCode>configureStore</StyledCode> and slice-based architecture
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>RTK 2.0 Features:</strong> Leveraged advanced thunk capabilities within slices
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Final Architecture:</strong> Migrated to RTK Query for efficient data fetching and caching
                                </>
                            }
                        />
                    </ListItem>
                </List>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Form Management
                </Typography>
                <Typography variant="body1">
                    The application demonstrates flexible form handling approaches:
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    Initially utilized <strong>Formik</strong> for form state management and validation
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    Later transitioned to <strong>React Hook Form</strong> for improved performance and reduced re-renders
                                </>
                            }
                        />
                    </ListItem>
                </List>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Development Practices
                </Typography>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Testing Strategy
                </Typography>
                <Typography variant="body1">
                    Test-Driven Development (TDD) was employed throughout the development process,
                    with comprehensive unit tests written for reducer functions to ensure application
                    stability and reliability.
                </Typography>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Component Development
                </Typography>
                <Typography variant="body1">
                    <strong>Storybook</strong> was integrated into the development workflow,
                    enabling isolated component development and visual testing.
                </Typography>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Styling Approach
                </Typography>
                <Typography variant="body1">
                    The application employs multiple styling methodologies:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <FeatureChip label="CSS Modules" color="primary" variant="outlined" />
                    <FeatureChip label="Styled Components" color="secondary" variant="outlined" />
                    <FeatureChip label="MUI Library" color="info" variant="outlined" />
                </Box>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Key Features
                </Typography>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Drag and Drop Functionality using dnd-kit library
                </Typography>
                <Typography variant="body1">
                    Interactive drag-and-drop capabilities allow users to reorder todos and rearrange
                    tasks within individual todo items, enhancing user experience and task management
                    flexibility.
                </Typography>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Security Features
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>CAPTCHA Integration:</strong> Implements CAPTCHA verification after
                                    several failed login attempts, providing protection against brute-force attacks
                                </>
                            }
                        />
                    </ListItem>
                </List>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Error Handling (application errors, network errors, zod validation errors handling)
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Toastify Notifications:</strong> Comprehensive error feedback system displaying user-friendly toast messages
                                </>
                            }
                        />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText
                            primary={
                                <>
                                    <strong>Loading States:</strong> Visual loading indicators (spinners) to enhance user experience during asynchronous operations
                                </>
                            }
                        />
                    </ListItem>
                </List>

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2, color: 'text.secondary' }}>
                    Data Validation
                </Typography>
                <Typography variant="body1">
                    <strong>Zod</strong> schema validation ensures:
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText primary="Form input validation before submission" />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText primary="Server response validation to maintain data integrity" />
                    </ListItem>
                </List>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Build and Development Tools
                </Typography>
                <Typography variant="body1">
                    The project started with <strong>Create React App</strong> (CRA) using <strong>Typescript</strong> and was subsequently
                    migrated to <strong>Vite</strong>, benefiting from:
                </Typography>
                <List sx={{ pl: 2 }}>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText primary="Faster build times" />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText primary="Improved development server performance" />
                    </ListItem>
                    <ListItem sx={{ display: 'list-item', pl: 0 }}>
                        <ListItemText primary="Modern ES module support" />
                    </ListItem>
                </List>
            </StyledPaper>

            <StyledPaper elevation={2}>
                <Typography variant="h5" component="h2" gutterBottom color="primary">
                    Project Documentation
                </Typography>
                <Typography variant="body1">
                    All major architectural changes and refactoring efforts are documented through the
                    project's commit history. Specific commits corresponding to each major architectural
                    transition are referenced in the the{' '}
                    <Link
                        href="https://github.com/Intrstng/Todolist"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        README.md
                    </Link>
                    , allowing developers to trace the
                    evolution of the application's architecture.
                </Typography>
            </StyledPaper>

            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                    This TodoList application represents a comprehensive practical implementation of
                    modern React patterns, demonstrating adaptability and commitment to following
                    industry best practices while maintaining a functional and user-friendly task
                    management solution.
                </Typography>
            </Box>
        </Container>
    );
};