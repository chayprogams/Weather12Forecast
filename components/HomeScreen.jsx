import { View, Text, Image, StatusBar, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon, MapPinIcon, CalendarDaysIcon } from 'react-native-heroicons/outline';
import { Theme } from '../theme/Theme';
import { useState, useCallback } from 'react';
import { localendpoint, forcastendpoint } from '../Api/Api';
import debounce from 'lodash.debounce';

const HomeScreen = () => {
    const [input, setInput] = useState('');
    const [locations, setLocation] = useState([]);
    const [data, setData] = useState({});
    const [bool, setBool] = useState(false);

    const handleClick = async () => {
        setLocation([]);
        try {
            const response = await localendpoint({ cityName: input });
            setLocation(response);
        } catch (error) {
            console.error(error);
        }
    };

    const onHandleInput = async (value) => {
        setInput(value);
        try {
            const response = await localendpoint({ cityName: value });
            setLocation(response);
        } catch (error) {
            console.error(error);
        }
    };

    const handler = useCallback(debounce(onHandleInput, 2000), []);

    const onHandleLocation = async (loc) => {
        setBool(true);
        try {
            const response = await forcastendpoint({ cityName: loc.name, days: '7' });
            setData(response);
        } catch (error) {
            console.error(error);
        }
    };

    const { current, location, forecast } = data;

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <Image source={require('../assets/images/bg.png')} className="absolute h-full w-full" blurRadius={70} />
            <SafeAreaView>
                <View style={styles.container}>
                    <TextInput
                        style={styles.textinput}
                        placeholder='Search City'
                        placeholderTextColor='white'
                        onChangeText={handler}
                    />
                    <TouchableOpacity onPress={handleClick}>
                        <MagnifyingGlassIcon size={25} color='white' style={styles.magnifyglass} />
                    </TouchableOpacity>
                </View>
             
                  <View style={styles.container1}>
                  {input && locations.length > 0 &&
                      locations.map((local, index) => (
                          <TouchableOpacity
                              style={{ flexDirection: 'row', borderBottomColor: 'black', borderWidth: 1 }}
                              onPress={() => onHandleLocation(local)}
                              key={index}
                          >
                              <MapPinIcon size={30} color='black' style={{ marginVertical: 5, marginHorizontal: 5 }} />
                              <Text style={{ marginHorizontal: 10, marginVertical: 10, fontSize: 15 }}>{local.name},{local.country}</Text>
                          </TouchableOpacity>
                      ))
                  }
              </View>
                
              
                {input && bool &&
                    <><View style={{ marginTop: 20 }}>
                        <View className='mt-4'>
                            <Text className='text-white text-center text-2xl font-bold'>
                                {location?.country},
                                <Text className='text-lg font-semibold text-gray-300'>{location?.name}</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>
                                <Image
                                    source={current?.condition?.text === 'Overcast' ? require('../assets/images/Overcast.png') :
                                        current?.condition?.text === 'Partly Cloudy' ? require('../assets/images/partlycloudy.png') :
                                            current?.condition?.text === 'Sunny' ? require('../assets/images/sun.png') :
                                                current?.condition?.text === 'Moderate or heavy rain with thunder' ? require('../assets/images/moderaterain.png') :
                                                    current?.condition?.text === 'Patchy rain nearby' ? require('../assets/images/heavyrain.png') : ''}
                                    className='w-52 h-52' />
                            </View>
                            <View>
                                <Text className='text-center font-bold text-white text-6xl ml-5'>{current?.temp_c}&#176;</Text>
                                <Text className='text-center text-white text-xl tracking-widest'>{current?.condition?.text}</Text>
                            </View>
                        </View>
                        <View className='flex-row justify-between mx-4' style={{ marginTop: 45, marginHorizontal: 15 }}>
                            <View className='flex-row items-center space-x-2'>
                                <Image source={require('../assets/icons/wind.png')} className='h-6 w-6' />
                                <Text className='text-white'>{current?.wind_kph}</Text>
                            </View>
                            <View className='flex-row items-center space-x-2'>
                                <Image source={require('../assets/icons/drop.png')} className='h-6 w-6' />
                                <Text className='text-white'>{current?.humidity}</Text>
                            </View>
                            <View className='flex-row items-center space-x-2'>
                                <Image source={require('../assets/icons/sun.png')} className='h-6 w-6' />
                                <Text className='text-white'>{new Date(location?.localtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                            </View>
                        </View>
                    </View><View className='mb-2 space-y-3 mt-4'>
                            <View className='flex-row items-center mx-5 space-x-2'>
                                <CalendarDaysIcon size={22} color='white' />
                                <Text className='text-base text-white'>Daily Forecast</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='space-x-4' style={{ marginHorizontal: 15 }}>
                                {forecast?.forecastday?.map((forecasts, index) => {
                                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                    const date = new Date(forecasts?.date);
                                    const dayName = daysOfWeek[date.getDay()];
                                    return (
                                        <View className='flex justify-center items-center rounded-3xl' key={index} style={{ backgroundColor: Theme.bgWhite(0.15), paddingHorizontal: 14, paddingVertical: 14 }}>
                                            <Image source={require('../assets/images/heavyrain.png')} className='h-11 w-11' />
                                            <Text className='text-white'>{dayName}</Text>
                                            <Text className='text-white'>{forecasts?.day?.maxtemp_c}&#176;</Text>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                        </View></>
}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Theme.bgWhite(0.5),
        marginHorizontal: 15,
        borderRadius: 25,
        marginTop: 7
    },
    container1: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 7,
        borderRadius: 15,
    },
    textinput: {
        flex: 1,
        marginLeft: 12
    },
    magnifyglass: {
        marginHorizontal: 10,
        marginVertical: 10,
    }
});

export default HomeScreen;
