import React, { useEffect, useState } from 'react';
import { Feather as Icon } from "@expo/vector-icons";
import { View, Image, StyleSheet, Text, ImageBackground, KeyboardAvoidingView, Platform, Picker, ActivityIndicator, Alert } from 'react-native';
import { RectButton, TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Axios from 'axios';

interface IBGEUFRes {
    sigla: string
}
interface IBGECityRes {
    nome: string
}

const Home = () => {
    const navigation = useNavigation()

    const [uf, setUf] = useState(null)
    const [city, setCity] = useState(null)
    const [cities, setCities] = useState<string[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        setLoaded(false)
        Axios.get<IBGEUFRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
            .catch(e => setError(true))
            .finally(() => setLoaded(true))
    }, [])

    useEffect(() => {
        setLoaded(false)
        if (uf === '0') {
            return
        }
        Axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(res => {
                const cityNames = res.data.map(city => city.nome)
                setCities(cityNames)
            })
            .catch(e => setError(true))
            .finally(() => setLoaded(true))
    }, [uf])

    function handleNavigateToPoints() {
        let title
        if (!uf || !city) {
            !uf ? title = "UF " : title = "Cidade "
            return Alert.alert(title + "Inválida", "Por favor, preencha o formulário")
        }
        navigation.navigate('Points', {
            uf,
            city
        })
    }

    if (!loaded) {
        return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>
    }

    if (error) {
        return <Text>Ocorreu um erro...</Text>
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : undefined}>
            <ImageBackground source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Picker
                        style={styles.input}
                        selectedValue={uf}
                        onValueChange={v => setUf(v)}>

                        <Picker.Item value={null} label={"Selecione a UF"} />
                        {
                            ufs.map(u => (
                                <Picker.Item key={u} label={u} value={u} />
                            ))
                        }
                    </Picker>
                    {
                        uf &&
                        <Picker
                            style={styles.input}
                            selectedValue={city}
                            onValueChange={v => setCity(v)}>

                            <Picker.Item value={null} label={"Selecione a Cidade"} />
                            {
                                cities.map(c => (
                                    <Picker.Item key={c} label={c} value={c} />
                                ))
                            }
                        </Picker>
                    }

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#fff" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}
export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {

    },

    select: {
        borderRadius: 600,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        marginBottom: 8,
    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});