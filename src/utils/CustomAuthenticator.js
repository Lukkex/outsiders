//Customized version of Authenticator component from the AWS Amplify library

import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import {
    Authenticator,
    CheckboxField,
    Text,
    useTheme,
    Heading,
    Image,
    View,
    Button,
    useAuthenticator,
  } from '@aws-amplify/ui-react';
import SiteHeader from './SiteHeader';

export default function CustomAuthenticator({content}) {
    return (
        <Authenticator
            initialState="signIn" // Defaults to the Sign In screen
            components={{
            SignUp: {
                FormFields() {
                const { validationErrors } = useAuthenticator();

                return (
                    <>
                    {/* Adds default form fields */}
                    <Authenticator.SignUp.FormFields />

                    {/* Adds a required Terms and Conditions field in order to sign up  */}
                    <CheckboxField
                        errorMessage={validationErrors.acknowledgement}
                        hasError={!!validationErrors.acknowledgement}
                        name="acknowledgement"
                        value="yes"
                        label="I agree with the Terms and Conditions"
                    />
                    </>
                );
                },
            },
            }}
            services={{
            async validateCustomSignUp(formData) {
                if (!formData.acknowledgement) {
                return {
                    acknowledgement: 'You must agree to the Terms and Conditions',
                };
                }
            },
            }}>
        {content}
        </Authenticator>
      );
};