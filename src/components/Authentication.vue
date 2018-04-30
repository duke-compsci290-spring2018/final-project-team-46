<template>
<ul>
    <li v-if="user"><a>{{user.name}}</a></li>
    <li v-if="user" @click="signOut"><a><span class="glyphicon glyphicon-log-out"></span>Logout</a></li>
    <li v-else @click="signInPopup"><a><span class="glyphicon glyphicon-user"></span>Sign In</a></li>
    <div id="firebaseui-auth-container" :class="{ popup: isShown }"></div>
</ul>
</template>

<script>
import Firebase from 'firebase'
import FirebaseUI from 'firebaseui'
var authUI = new FirebaseUI.auth.AuthUI(Firebase.auth())
export default {
    name: 'Authentication',
    data () {
        return {
            isShown: false
        }
    },
    props: [
        'getUser',
        'setUser',
        'refreshSetUser',
        'signedIn'
    ],
    computed: {
        user () {
            return this.getUser()
        }
    },
    // methods for signing in and out
    methods: {
        signInPopup () {
            authUI.start('#firebaseui-auth-container', {
                signInFlow: 'popup',
                // require password each time
                credentialHelper: FirebaseUI.auth.CredentialHelper.NONE,
                // new users automatically created for new emails
                signInOptions: [{
                    provider: Firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true
                }],
                callbacks: {
                    signInSuccessWithAuthResult: authResult => {
                        this.signIn(authResult.user)
                        this.isShown = false
                        return false
                    },
                    uiShown: () => {
                        // style UI container as a popup
                        this.isShown = true
                    }
                }
            })
        },
        signIn (user) {
            this.setUser({
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                isAnonymous: user.isAnonymous
            })
        },
        signOut () {
            Firebase.auth().signOut()
            this.setUser(null)
        },
        refresh(user){
            this.refreshSetUser({
                name: user.displayName,
                email: user.email,
                uid: user.uid,
                isAnonymous: user.isAnonymous
            })
        }
    },
    mounted () {
        // allow user to automatically log in if returning to site after refresh
        Firebase.auth().onAuthStateChanged(authState => {
            if (authState) {
                this.refresh(authState)
                //console.log(authState)
            }
        })
    }
}
</script>

<style scoped>
.popup {
    position: absolute;
    padding: 15px;
    width: 350px;
    height: 250px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,0%);
}
</style>