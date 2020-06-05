import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from "react-icons/fi";
import './styles.css'
import logo from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import Axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
    // Tipagem em minúsculo!
    id: number
    title: string
    image_url: string
}

interface IBGEUFRes {
    sigla: string
}
interface IBGECityRes {
    nome: string
}

const CreatePoint = () => {

    // Sempre que criar um array ou objeto,
    // deve-se informar o tipo da variável!
    // Solução: Interface!
    const [items, setItems] = useState<Item[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [ufs, setUfs] = useState<string[]>([])

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const [selectedUf, setSelectedUf] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')
    const [selectedItems, setSelectedItems] = useState<number[]>([])

    const history = useHistory()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })


    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    function handleMapClick(e: LeafletMouseEvent) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
    }

    function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
        const city = e.target.value
        setSelectedCity(city)
    }
    // Tipagem...
    function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>) {
        const uf = e.target.value
        setSelectedUf(uf)
    }

    function handleSelectItem(id: number) {
        // por isso, spread operators
        // push altera a informação original

        const alreadySelected = selectedItems.findIndex(item => item === id)

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else {
            setSelectedItems([...selectedItems, id])
        }
    }
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        await api.post('/points', data)
        alert('Ponto de Coleta Criado Com Sucesso!')
        return history.push('/')
    }

    // Não pode ser em async await
    // vazio: 1x
    useEffect(() => {
        api.get('/items')
            .then(res => {
                setItems(res.data)
            })
    }, [])

    useEffect(() => {
        Axios.get<IBGEUFRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then(res => {
                const ufInitials = res.data.map(uf => uf.sigla)
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if (selectedUf === '0') {
            return
        }
        Axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(res => {
                const cityNames = res.data.map(city => city.nome)
                setCities(cityNames)
            })
    }, [selectedUf])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to='/'>
                    <FiArrowLeft />
                        Voltar para home
                    </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input onChange={handleInputChange} type="text" name="name" id="name" />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input onChange={handleInputChange} type="text" name="email" id="email" />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input onChange={handleInputChange} type="text" name="whatsapp" id="whatsapp" />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o Endereço no mapa</span>
                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </Map>
                    </legend>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select value={selectedUf} onChange={handleSelectedUf} name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {
                            items.map(item => (
                                <li key={item.id} onClick={() => handleSelectItem(item.id)} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                                    <img src={item.image_url} alt={item.title} />
                                    <span>{item.title}</span>
                                </li>
                            ))
                        }
                    </ul>
                </fieldset>
                <button type='submit'>
                    Cadastrar Ponto de Coleta
                </button>
            </form>
        </div>
    )
}
export default CreatePoint;