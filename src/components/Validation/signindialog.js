import React from 'react';
import propTypes from 'prop-types';
import classNames from 'classnames';

import { withFirebase } from '../Firebase';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';

import { SignUpLink } from './index';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

import ExitToAppIcon from '@material-ui/icons/ExitToAppRounded';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
    popupopen: false
}

const styles = theme => ({
    customBTN: {
        color: theme.palette.getContrastText('#fff'),
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: '#4BB543',
        },
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
})

const Transition = (props) => {
    return <Slide direction="up" {...props} />;
}

class SignInDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE
        };
    }

    // TODO: Signin paused due to missing authUser. Focus first on creating auth.

    

    onSubmit = event => {
        const { email, password } = this.state;

        this.setState(prevState => ({
            popupopen: !prevState.popupopen
        }))
        
        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                this.props.handleClose();
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
                setTimeout(() => {
                    this.setState(prevState => ({
                        popupopen: !prevState.popupopen
                    }))
                }, 3000)
            });

        event.preventDefault();
    }


    onChange = event => {
        this.setState({[event.target.name] : event.target.value})
    }

    render() {
        const {
            email,
            password,
            popupopen,
            error
        } = this.state;

        const { classes, open, handleClose } = this.props;

        const isInvalid = password === '' || email === '';

        return (
                <Dialog
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                    keepMounted
                    fullWidth
                    maxWidth="sm"
                >
                <form onSubmit = {this.onSubmit}>
                    <DialogTitle>
                        Enter Credentials
                        </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <SignUpLink handleClose={handleClose} />
                        </DialogContentText>

                        <TextField
                            name = "email"
                            autoFocus
                            margin="dense"
                            id="email"
                            label="Email"
                            type="email"
                            fullWidth
                            autoComplete = "email"
                            value={email}
                            onChange = {this.onChange}
                        />
                        <TextField
                            name = "password"
                            margin="dense"
                            id="name"
                            label="Password"
                            type="password"
                            fullWidth
                            autoComplete = "current-password"
                            onChange = {this.onChange}
                            value={password}
                        />

                    </DialogContent>

                    {error &&
                        <div
                            className={popupopen ? 'alert alert-danger my-3' : 'd-none'}
                            role="alert"
                        >{error.message}
                        </div>
                    }

                    <DialogActions>
                        <Button
                            type = "submit"
                            disabled = {isInvalid}
                            variant="contained"
                            className={classes.customBTN}
                        >
                            <ExitToAppIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                            Sign-in
                            </Button>
                    </DialogActions>
                    </form>
                </Dialog>
        )
    }
}

SignInDialog.propTypes = {
    classes: propTypes.object.isRequired,
    open: propTypes.bool.isRequired,
    handleClose: propTypes.func.isRequired,
}

const SignIn = compose(
    withFirebase,
    withStyles(styles),
    withRouter
)(SignInDialog);

export default SignIn;