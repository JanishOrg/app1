import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, DrawerLayoutAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../assets/icons/home-1-svgrepo-com.svg';
import FAQ from '../assets/icons/faq-svgrepo-com.svg';
import Help from '../assets/icons/help-svgrepo-com.svg';
import Transit from '../assets/icons/calgary-transit-my-fare-svgrepo-com.svg';
import Car from '../assets/icons/car-side-svgrepo-com.svg';
import Menu from '../assets/icons/menu-svgrepo-com.svg';
import Share from '../assets/icons/share-svgrepo-com.svg';
import { API_URL } from '@env';
import { useColorScheme } from 'react-native';


const Rides = () => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [username, setusername] = useState('');
    const [profileimage, setprofileimage] = useState('');
    const [rideData, setRideData] = useState();
    const [showPastRides, setShowPastRides] = useState(false);
    const [showActiveRides, setShowActiveRides] = useState(false);
    const [showCurrentRides, setShowCurrentRides] = useState(true);
    const [yourrides, setyourrides] = useState([]);
    const [showDriverAcceptedRides, setshowDriverAcceptedRides] = useState(false);
    const colorScheme = useColorScheme();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve user_id from AsyncStorage
                const value = await AsyncStorage.getItem('user');

                // Check if user_id exists
                if (value) {
                    // Make a fetch call to get user data
                    const response = await fetch(`${API_URL}/api/driver/${value}`);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const responseData = await response.json();
                    setusername(responseData.username);
                    setprofileimage(responseData.profileimage);
                    setUserData(responseData.main);
                    console.log("Data Fetched Success");
                } else {
                    console.error('User ID not found in AsyncStorage');
                    // Handle the case where user_id is not present in AsyncStorage
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle errors, show an error message or redirect to a different screen
            }
        };

        // Fetch user data initially
        fetchData();

        // Fetch user data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // The empty dependency array ensures the effect runs only once when the component mounts

    const RedirectPage = (page) => {
        console.log(page, ' Pressed');
        navigation.navigate(page);
    }

    const Logout = async () => {
        try {
            // Retrieve user_id from AsyncStorage
            const value = await AsyncStorage.getItem('user');

            // Check if user_id exists
            if (value) {
                // Make a fetch call to logout
                const response = await fetch(`${API_URL}/api/logout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: value }),
                });

                if (response.ok) {
                    // Logout successful
                    console.log('Logout successful');
                    navigation.navigate('LoginPage');
                } else {
                    console.error('Logout failed:', response.status);
                }
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const confirmbook = async (rideId, driverId) => {
        try {
            // Retrieve user_id from AsyncStorage
            const userId = await AsyncStorage.getItem('user');

            // Prepare the data for the API call
            const requestData = {
                status: 3,
                // Add any other necessary data for the booking confirmation
            };

            // Make the API call to confirm the booking
            const response = await fetch(`${API_URL}/api/update-from-user/${driverId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any other necessary headers
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                // Handle successful confirmation
                // For example, show a success message
                alert('Booking confirmed successfully!');
            } else {
                // Handle error response from the API
                // For example, show an error message
                alert('Failed to confirm booking. Please try again later.');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            // Handle any errors that occur during the API call
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('user');

                if (showPastRides) {
                    // Fetch past rides data
                    const response = await fetch(`${API_URL}/api/get-ended-rides/${value}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setyourrides(data);
                } else if (showActiveRides) {
                    // Fetch active rides data
                    const response = await fetch(`${API_URL}/api/get-active-rides/${value}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setyourrides(data);
                } else if (showCurrentRides) {
                    // Fetch current rides data
                    const response = await fetch(`${API_URL}/api/get-current-rides/${value}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setyourrides(data);
                } else if (showDriverAcceptedRides) {
                    // Fetch current rides data
                    const response = await fetch(`${API_URL}/api/get-driveraccepted-rides/${value}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setyourrides(data);
                }
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        };

        // Initial fetch
        fetchData();

        // Set up interval to fetch data every 3 seconds
        const intervalId = setInterval(fetchData, 3000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [showPastRides, showActiveRides, showCurrentRides, showDriverAcceptedRides]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.drawerButton} onPress={toggleDrawer}>
                    <Menu width="24" height="24" />
                </TouchableOpacity>
                <Text style={styles.welcomeText}> Rides </Text>
            </View>
            {isDrawerOpen && (
                <View style={styles.drawerContent}>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => setIsDrawerOpen(false)}>
                        <Text style={styles.drawerOptionText}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('SelectCarPage')}>
                        <Text>
                            <Home width="24" height="24" />
                            <Text style={styles.drawerOptionText}>Home</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('Rides')}>
                        <Text>
                            <Car width="24" height="24" />
                            <Text style={styles.drawerOptionText}>Rides</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('Farechart')}>
                        <Text>
                            <Transit width="24" height="24" />
                            <Text style={styles.drawerOptionText}>Fare Chart</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('Faq')}>
                        <Text>
                            <FAQ width="24" height="24" />
                            <Text style={styles.drawerOptionText}>FAQ</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('Helpandsupport')}>
                        <Text>
                            <Help width="24" height="24" />
                            <Text style={styles.drawerOptionText}>Help and Support</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.drawerOption}
                        onPress={() => RedirectPage('Shareapp')}>
                        <Text>
                            <Share width="24" height="24" />
                            <Text style={styles.drawerOptionText}>Share App</Text>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.drawerOption} onPress={Logout}>
                        <Text style={styles.drawerOptionText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.nheader}>
                <TouchableOpacity onPress={() => { setShowPastRides(true); setShowActiveRides(false); setShowCurrentRides(false); setshowDriverAcceptedRides(false); }}>
                    <Text style={[styles.nheaderText, showPastRides && styles.activeHeaderText]}>Ended</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPastRides(false); setShowActiveRides(true); setShowCurrentRides(false); setshowDriverAcceptedRides(false); }}>
                    <Text style={[styles.nheaderText, showActiveRides && styles.activeHeaderText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPastRides(false); setShowActiveRides(false); setShowCurrentRides(true); setshowDriverAcceptedRides(false); }}>
                    <Text style={[styles.nheaderText, showCurrentRides && styles.activeHeaderText]}>Requested</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowPastRides(false); setShowActiveRides(false); setShowCurrentRides(false); setshowDriverAcceptedRides(true); }}>
                    <Text style={[styles.nheaderText, showDriverAcceptedRides && styles.activeHeaderText]}>Accepted</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.shadowBox}>
                {showPastRides && (
                    <>
                        <Text style={styles.rideTitle}>Ended Rides</Text>
                        {yourrides ? (
                            yourrides.map((ride) => (
                                <View key={ride.id} style={styles.rideBox}>
                                    <Text style={styles.texttab}>Destination: {ride.destination_address}</Text>
                                    <Text style={styles.texttab}>Pickup Address: {ride.pickup_address}</Text>
                                    <Text style={styles.texttab}>People Count: {ride.people_count}</Text>
                                    <View style={styles.separator}></View>
                                </View>

                            ))
                        ) : (
                            <Text style={styles.noRidesText}>No data available</Text>
                        )}
                    </>
                )}
                {showActiveRides && (
                    <>
                        <Text style={styles.rideTitle}>Active Rides</Text>
                        {yourrides ? (
                            yourrides.map((ride) => (
                                <View key={ride.id} style={styles.rideBox}>
                                    <Text style={styles.texttab}>Destination: {ride.destination_address}</Text>
                                    <Text style={styles.texttab}>Pickup Address: {ride.pickup_address}</Text>
                                    <Text style={styles.texttab}>People Count: {ride.people_count}</Text>
                                    <View style={styles.separator}></View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noRidesText}>No data available</Text>
                        )}
                    </>
                )}
                {showCurrentRides && (
                    <>
                        <Text style={styles.rideTitle}>Requested Rides</Text>
                        {yourrides ? (
                            yourrides.map((ride) => (
                                <View key={ride.id} style={styles.rideBox}>
                                    <Text style={styles.texttab}>Destination: {ride.destination_address}</Text>
                                    <Text style={styles.texttab}>Pickup Address: {ride.pickup_address}</Text>
                                    <Text style={styles.texttab}>People Count: {ride.people_count}</Text>
                                    <View style={styles.separator}></View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noRidesText}>No data available</Text>
                        )}
                    </>
                )}
                {showDriverAcceptedRides && (
                    <>
                        <Text style={styles.rideTitle}>Accepted Rides</Text>
                        {yourrides ? (
                            yourrides.map((ride) => (
                                <View key={ride.id} style={styles.rideBox}>
                                    <TouchableOpacity style={styles.button} onPress={() => confirmbook(ride.id, ride.acpted_driver)}>
                                        <Text style={styles.buttonText}>Confirm Book</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.texttab}>Destination: {ride.destination_address}</Text>
                                    <Text style={styles.texttab}>Pickup Address: {ride.pickup_address}</Text>
                                    <Text style={styles.texttab}>People Count: {ride.people_count}</Text>
                                    <View style={styles.separator}></View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noRidesText}>No data available</Text>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    separator: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginVertical: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9b59b6',
        padding: 10,
        paddingBottom: 20,
        paddingTop: 30,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black', // Change color to black
        marginLeft: 16,
    },
    imageContainer: {
        alignItems: 'center',
    },
    imageBox: {
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
    },
    bigImage: {
        width: windowWidth - 40, // Adjust the width as necessary
        height: windowHeight * 0.3, // Adjust the height as necessary
        resizeMode: 'contain', // Use 'contain' to fit the image within the view
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingBottom: 20,
        paddingTop: 20,
    },
    pickupContainer: {
        padding: 20,
        alignItems: 'center',
    },
    pickupText: {
        fontSize: 16,
        color: 'black', // Change color to black
    },
    changeButton: {
        backgroundColor: '#9b59b6',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    changeButtonText: {
        fontSize: 16,
        color: 'black', // Change color to black
    },
    addressText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    rideTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 10,
    },
    rideTypeButton: {
        backgroundColor: '#9b59b6',
        padding: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rideTypeText: {
        fontSize: 16,
        color: 'black', // Change color to black
    },
    selectedRideType: {
        backgroundColor: '#ff9800', // Change color to indicate selection
    },
    indicator: {
        width: 10,
        height: 10,
        backgroundColor: 'green', // Adjust color as needed
        borderRadius: 5,
        marginLeft: 5,
    },
    carOption: {
        alignItems: 'center',
        marginRight: 10,
    },
    carImage: {
        width: 100,
        height: 60,
    },
    carText: {
        marginTop: 5,
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: '#9b59b6',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    nextButtonText: {
        fontSize: 20,
        color: 'black', // Change color to black
    },
    buttonText: {
        color: 'white',
    },
    selectedCar: {
        borderColor: 'purple',
        borderWidth: 2,
        borderRadius: 5,
        padding: 5,
    },
    drawerContent: {
        flex: 1,
        padding: 16,
    },
    drawerButton: {
        marginLeft: 16,
    },
    centeredContainer: {
        alignItems: 'center',
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    drawerButton: {
        marginLeft: 16,
        marginTop: 16,
    },
    drawerContent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fff',
        width: 250, // Adjust the width as needed
        elevation: 16, // For shadow on Android
        zIndex: 1, // Ensure the drawer content appears above other content
    },
    drawerOption: {
        padding: 16,
    },
    drawerOptionText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'normal',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        backgroundColor: 'black',
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    textContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    nheader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    nheaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    activeHeaderText: {
        color: '#9b59b6',
    },
    shadowBox: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    rideTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    noRidesText: {
        fontSize: 16,
        marginBottom: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#9b59b6',
        color: 'black', // Change color to black
        padding: 10,
        borderRadius: 5,
        textAlign: 'center',
        width: '45%',
    },
    ridebox: {
        color: 'black',
    },
    texttab: {
        color: "black",
        fontSize: 14,
    }
});

export default Rides;
