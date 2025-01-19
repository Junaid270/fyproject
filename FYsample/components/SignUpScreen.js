import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [aadharNumber, setAadharNumber] = React.useState("");

  const [emailError, setEmailError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");
  const [aadharError, setAadharError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  // Function to validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate password
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  // Handle Sign Up Validation
  const handleSignUp = () => {
    let valid = true;

    // Clear previous error messages
    setEmailError("");
    setPhoneError("");
    setAadharError("");
    setPasswordError("");

    if (!username.trim()) {
      valid = false;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address!");
      valid = false;
    }

    if (phoneNumber.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits!");
      valid = false;
    }

    if (aadharNumber.length !== 12) {
      setAadharError("Aadhar number must be exactly 12 digits!");
      valid = false;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must contain at least one uppercase letter, \n one special character , and digits."
      );
      valid = false;
    }

    if (valid) {
      // Proceed to next step or navigate to another screen
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.SignUpScreen}>
        <Image
          source={require("../assets/sign.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <Text style={styles.title}>Sign Up ✅</Text>
      <Text style={styles.text}>Let’s create your account!</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* Username */}
          <Text style={styles.usernameHeader}>Username</Text>
          <TextInput
            style={styles.nameinput}
            placeholder="Avoid using your real name."
            keyboardType="default"
            value={username}
            onChangeText={setUsername}
          />

          {/* Phone Number */}
          <Text style={styles.phoneHeader}>Phone Number</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          {/* Aadhar Number */}
          <Text style={styles.aadHeader}>Aadhar Number</Text>
          <TextInput
            style={styles.aadInput}
            placeholder="Enter your 12-digit Aadhar number"
            keyboardType="numeric"
            maxLength={12}
            value={aadharNumber}
            onChangeText={setAadharNumber}
          />
          {aadharError ? <Text style={styles.errorText}>{aadharError}</Text> : null}

          {/* Email */}
          <Text style={styles.emailHeader}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Password */}
          <Text style={styles.passHeader}>Password</Text>
          <TextInput
            style={styles.passInput}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={{ height: 2, width: "100%", backgroundColor: "#EEEEEE", marginVertical: 10 }}></View>

          <View style={styles.noAccount}>
            <Text>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.regiText}>Sign In</Text>
            </Pressable>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFF",
    position: "absolute",
    zIndex: 1,
    top: 180,
    paddingRight: 200,
  },
  text: {
    fontSize: 16,
    color: "#FFFF",
    position: "absolute",
    zIndex: 1,
    top: 230,
    paddingRight: 170,
    paddingLeft: 10,
  },
  SignUpScreen: {
    width: "100%",
    height: 260,
    top: 0,
    position: "absolute",
    zIndex: 1,
  },
  scrollContainer: {
    paddingTop: 260,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  usernameHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    paddingRight: 225,
  },
  nameinput: {
    width: 340,
    height: 70,
    margin: 8,
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
  },
  phoneHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    paddingRight: 172,
  },
  phoneInput: {
    width: 340,
    height: 70,
    margin: 8,
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
  },
  aadHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    paddingRight: 160,
  },
  aadInput: {
    width: 340,
    height: 70,
    margin: 8,
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
  },
  emailHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    paddingRight: 275,
  },
  input: {
    width: 340,
    height: 70,
    margin: 8,
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
  },
  passHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    paddingRight: 230,
  },
  passInput: {
    width: 340,
    height: 70,
    margin: 12,
    borderWidth: 1,
    padding: 20,
    borderRadius: 18,
  },
  regiText: {
    color: "#235DFF",
    textDecorationLine: "underline",
  },
  noAccount: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#235DFF",
    padding: 20,
    borderRadius: 18,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    alignSelf: "flex-start",
    marginLeft: 35,
  },
});

export default SignUpScreen;
