import React, {useState, useEffect} from "react";
import api from "../../services/api";
import {isAuth} from "../../utils/auth";

import "./styles.css";

import {useHistory} from "react-router-dom";

import {FaAngleRight} from "react-icons/fa";

import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {Link, animateScroll as scroll} from "react-scroll";

import BurgerMenu from "../../components/BurgerMenu";

import ModalLogin from "../../components/ModalLogin";
import ModalEscolhaCadastro from "../../components/ModalEscolhaCadastro";
import ModalCadastroEmpresa from "../../components/ModalCadastroEmpresa";
import ModalCadastroColaborador from "../../components/ModalCadastroColaborador";

import Logo from "../../assets/logo.png";

import {setLocalStorage} from "../../utils/localStorage";

export default function LandingPage() {
    const [showModalLogin, setShowModalLogin] = useState(false);
    const [showModalEscolha, setShowModalEscolha] = useState(false);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [showModalColaborador, setShowModalColaborador] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (isAuth()) {
            history.push("/dashboard");
        }

        if (history.location.state && history.location.state.error === 1) {
            toast.error("A sessão expirou, realize o login novamente");
        }
    }, [history]);

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    const handleModalLogin = () => {
        setShowModalLogin(!showModalLogin);
    };

    const handleModalEscolha = () => {
        setShowModalEscolha(!showModalEscolha);
    };

    const handleModalEscolhaSubmit = (op) => {
        setShowModalEscolha(false);

        if (op === "empresa") {
            setShowModalEmpresa(true);
        } else {
            setShowModalColaborador(true);
        }
    };

    const registerCompany = async (companyData) => {
        setShowModalEmpresa(false);

        const companyModel = {
            name: companyData.companyName.trim(),
            email: companyData.email.toLowerCase().trim(),
            password: companyData.password.trim(),
            is_owner: true,
        };

        try {
            await api.post("/user", companyModel);

            toast.success(
                "Conta criada com sucesso, verifique seu email para validar sua conta!",
                {
                    autoClose: false,
                }
            );
        } catch (error) {
            if (error.response.data.err) {
                return toast.error("Email já cadastrado!");
            }

            toast.error("Ocorreu um erro inesperado.");
        }
    };

    const registerColab = async (colabData) => {
        setShowModalColaborador(false);

        const colabModel = {
            name: colabData.colabName.trim(),
            email: colabData.email.toLowerCase().trim(),
            password: colabData.password.trim(),
            is_owner: false,
        };

        try {
            await api.post("/user", colabModel);

            toast.success(
                "Conta criada com sucesso, verifique seu email para validar sua conta!",
                {
                    autoClose: false,
                }
            );
        } catch (error) {
            if (error.response.data.err) {
                return toast.error("Email já cadastrado!");
            }

            toast.error("Ocorreu um erro inesperado.");
        }
    };

    const login = async (dataLogin) => {
        try {
            const modelUserLogin = {
                email: dataLogin.email.toLowerCase().trim(),
                password: dataLogin.password.trim(),
            };

            const response = await api.post("/login", modelUserLogin);

            setShowModalLogin(false);

            setLocalStorage("@Flush:user", response.data.user);
            setLocalStorage("@Flush:token", response.data.token);

            history.push("/dashboard");
        } catch (error) {
            if (error.response && error.response.status === 403) {
                return toast.error(
                    "Sua conta não está ativa, verifique seu email para ativa-la."
                );
            }

            if (error.response && error.response.data.err) {
                return toast.error(
                    "Erro ao realizar o login do usuário. Tente novamente"
                );
            }

            toast.error("Ocorreu um erro inesperado.");
        }
    };

    return (
        <>
            {showModalLogin && (
                <ModalLogin login={login} handleModalLogin={handleModalLogin}/>
            )}
            {showModalEscolha && (
                <ModalEscolhaCadastro
                    handleModalEscolha={handleModalEscolha}
                    handleSubmited={handleModalEscolhaSubmit}
                />
            )}
            {showModalEmpresa && (
                <ModalCadastroEmpresa
                    handleModalEmpresa={() => setShowModalEmpresa(false)}
                    registerCompany={registerCompany}
                />
            )}

            {showModalColaborador && (
                <ModalCadastroColaborador
                    handleModalColaborador={() => setShowModalColaborador(false)}
                    registerColab={registerColab}
                />
            )}


            <section className="relative w-full h-auto bg-no-repeat bg-cover overflow-hidden"
                     style={{backgroundImage: 'url(https://images.unsplash.com/photo-1533693706533-57740e69765d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=2700&amp;q=80)'}}>

                <div className="absolute inset-0 z-0 h-full bg-gray-900 opacity-25"/>
                <div className="w-full h-20 p-5  to-purple-700">
                    <nav className="hidden w-full md:block">
                        <ul className="relative z-10 flex items-center px-6 text-sm text-white lg:text-base">
                            <li className="mx-2 lg:mx-3">
                                <Link to="/"
                                      className="cursor-pointer relative inline-block font-medium text-gray-200 hover:text-white">
                                    <span
                                        className="text-3xl font-black leading-none text-white select-none italic">Flush</span>
                                </Link>
                            </li>

                            <li className="mx-auto"/>

                            <li className="mx-2 lg:mx-3">
                                <button
                                    type="button"
                                    className="px-8 py-2 text-center text-white bg-white text-blue-600 font-bold transition rounded"
                                    onClick={handleModalEscolha}
                                >
                                    Cadastrar-se
                                </button>
                            </li>
                            <li className="mx-2 lg:mx-3">
                                <button
                                    type="button"
                                    className="px-8 py-2 text-center text-white  hover:bg-blue-50 hover:text-blue-600 transition  bg-transparent rounded"
                                    onClick={handleModalLogin}
                                >
                                    Fazer Login
                                </button>
                            </li>
                        </ul>
                    </nav>


                    <nav
                        className="fixed bg-gradient-to-r from-blue-500 to-purple-700 left-0 top-0 z-30 flex flex-col flex-wrap items-center justify-between w-full h-auto px-6 md:hidden">
                        <div className="relative z-30 flex items-center justify-between w-full h-20">
                            <Link to="/" className="flex items-center flex-shrink-0 mr-6 text-white">
                                <span
                                    className="text-3xl font-black leading-none text-white select-none italic">Flush</span>
                            </Link>
                            <div className="block lg:hidden flex flex-wrap justify-center items-center">
                                <button
                                    type="button"
                                    className="px-2 py-1 text-sm text-center text-white bg-white text-blue-600 font-bold transition rounded"
                                    onClick={handleModalEscolha}
                                >
                                    Cadastrar-se
                                </button>
                                <button
                                    type="button"
                                    className="mx-1 px-2 py-1 text-center text-white  hover:bg-blue-50 hover:text-blue-600 transition  bg-transparent rounded text-sm"
                                    onClick={handleModalLogin}
                                >
                                    Fazer Login
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="container flex items-center justify-center h-auto py-32 mx-auto">
                    <div className="z-10 flex flex-col items-center px-8 xl:px-0">
                        <h1 className="mx-6 italic mt-1 text-xl text-5xl font-black text-center text-white lg:text-6xl sm:text-center sm:mx-0">
                            Flush
                        </h1>
                        <p className="w-2/3 my-6 text-xl font-normal text-center text-gray-200">The ultimate toolset to
                            Finalize projetos, atinja metas e organize times com mais agilidade e autonomia.</p>
                        <div className="flex justify-center md:mt-10">
                            <button
                                className="px-8 transition py-2 m-2 text-center text-white bg-blue-700 border-2 border-blue-700 hover:bg-transparent rounded"
                                onClick={handleModalEscolha}>
                                Cadastrar-se
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            <section className="relative w-full py-12 overflow-hidden bg-white md:py-20 xl:pt-32 xl:pb-40">
                <div
                    className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0">
                    <h2 className="mb-1 text-3xl font-extrabold leading-tight text-gray-900">Recursos</h2>
                    <p className="mb-12 text-lg text-gray-500">Aqui estão algums dos nossos principais recursos.</p>

                    <div className="flex w-full h-full">

                        <div className="w-full lg:w-2/3">


                            <div className="flex flex-col w-full mb-10 sm:flex-row">
                                <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
                                    <div className="relative h-full ml-0 mr-0 sm:mr-10">
                                        <span
                                            className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>
                                        <div
                                            className="relative h-full p-5 bg-white border-2 border-indigo-500 rounded-lg">
                                            <div className="flex items-center -mt-1">
                                                <svg className="w-8 h-8 text-indigo-500 fill-current"
                                                     viewBox="0 0 20 20">
                                                    <polygon
                                                        points="18.198,7.95 3.168,7.95 3.168,8.634 9.317,9.727 9.317,19.564 12.05,19.564 12.05,9.727 18.198,8.634 "></polygon>
                                                    <path
                                                        d="M2.485,10.057v-3.41H2.473l0.012-4.845h1.366c0.378,0,0.683-0.306,0.683-0.683c0-0.378-0.306-0.683-0.683-0.683H1.119c-0.378,0-0.683,0.306-0.683,0.683c0,0.378,0.306,0.683,0.683,0.683h0.683v4.845C1.406,6.788,1.119,7.163,1.119,7.609v2.733c0,0.566,0.459,1.025,1.025,1.025c0.053,0,0.105-0.008,0.157-0.016l-0.499,5.481l5.9,2.733h0.931C8.634,13.266,5.234,10.458,2.485,10.057z"></path>
                                                    <path
                                                        d="M18.169,6.584c-0.303-3.896-3.202-6.149-7.486-6.149c-4.282,0-7.183,2.252-7.484,6.149H18.169z M15.463,3.187c0.024,0.351-0.103,0.709-0.394,0.977c-0.535,0.495-1.405,0.495-1.94,0c-0.29-0.268-0.418-0.626-0.394-0.977C13.513,3.827,14.683,3.827,15.463,3.187z"></path>
                                                    <path
                                                        d="M18.887,10.056c-2.749,0.398-6.154,3.206-6.154,9.508h0.933l5.899-2.733L18.887,10.056z"></path>
                                                </svg>
                                                <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">Dashboard</h3>
                                            </div>
                                            <p className="mb-2 text-gray-600">Acompanhe as informações dos seus times na
                                                dashboard personalizada.</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <div className="relative h-full ml-0 md:mr-10">
                                        <span
                                            className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-purple-500 rounded-lg"/>
                                        <div
                                            className="relative h-full p-5 bg-white border-2 border-purple-500 rounded-lg">
                                            <div className="flex items-center -mt-1">
                                                <svg className="w-8 h-8 text-purple-500 fill-current"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        d="M19.629,9.655c-0.021-0.589-0.088-1.165-0.21-1.723h-3.907V7.244h1.378V6.555h-2.756V5.866h2.067V5.177h-0.689V4.488h-1.378V3.799h0.689V3.11h-1.378V2.421h0.689V1.731V1.294C12.88,0.697,11.482,0.353,10,0.353c-5.212,0-9.446,4.135-9.629,9.302H19.629z M6.555,2.421c1.522,0,2.756,1.234,2.756,2.756S8.077,7.933,6.555,7.933S3.799,6.699,3.799,5.177S5.033,2.421,6.555,2.421z"></path>
                                                    <path
                                                        d="M12.067,18.958h-0.689v-0.689h2.067v-0.689h0.689V16.89h2.067v-0.689h0.689v-0.689h-1.378v-0.689h-2.067v-0.689h1.378v-0.689h2.756v-0.689h-1.378v-0.689h3.218c0.122-0.557,0.189-1.134,0.21-1.723H0.371c0.183,5.167,4.418,9.302,9.629,9.302c0.711,0,1.401-0.082,2.067-0.227V18.958z"></path>
                                                </svg>
                                                <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">Múltiplos
                                                    Times</h3>
                                            </div>
                                            <p className="mb-2 text-gray-600">Crie ou participe de múltiplos times,
                                                aumente sua produtividade.</p>
                                        </div>

                                    </div>
                                </div>
                            </div>


                            <div className="flex flex-col w-full mb-5 sm:flex-row">
                                <div className="w-full mb-10 sm:mb-0 sm:w-1/2">
                                    <div className="relative h-full ml-0 mr-0 sm:mr-10">
                                        <span
                                            className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-blue-400 rounded-lg"/>
                                        <div
                                            className="relative h-full p-5 bg-white border-2 border-blue-400 rounded-lg">
                                            <div className="flex items-center -mt-1">
                                                <svg className="w-8 h-8 text-blue-400 fill-current" viewBox="0 0 20 20">
                                                    <path
                                                        d="M18.21,16.157v-8.21c0-0.756-0.613-1.368-1.368-1.368h-1.368v1.368v1.368v6.841l-1.368,3.421h5.473L18.21,16.157z"/>
                                                    <path
                                                        d="M4.527,9.316V7.948V6.579H3.159c-0.756,0-1.368,0.613-1.368,1.368v8.21l-1.368,3.421h5.473l-1.368-3.421V9.316z"/>
                                                    <path
                                                        d="M14.766,5.895h0.023V5.21c0-2.644-2.145-4.788-4.789-4.788S5.211,2.566,5.211,5.21v0.685h0.023H14.766zM12.737,3.843c0.378,0,0.684,0.307,0.684,0.684s-0.306,0.684-0.684,0.684c-0.378,0-0.684-0.307-0.684-0.684S12.358,3.843,12.737,3.843z M10,1.448c0.755,0,1.368,0.613,1.368,1.368S10.755,4.185,10,4.185c-0.756,0-1.368-0.613-1.368-1.368S9.244,1.448,10,1.448z"/>
                                                    <path
                                                        d="M14.789,6.579H5.211v9.578l1.368,1.368h6.841l1.368-1.368V6.579z M12.052,12.052H7.948c-0.378,0-0.684-0.306-0.684-0.684c0-0.378,0.306-0.684,0.684-0.684h4.105c0.378,0,0.684,0.306,0.684,0.684C12.737,11.746,12.431,12.052,12.052,12.052z M12.052,9.316H7.948c-0.378,0-0.684-0.307-0.684-0.684s0.306-0.684,0.684-0.684h4.105c0.378,0,0.684,0.307,0.684,0.684S12.431,9.316,12.052,9.316z"/>
                                                </svg>
                                                <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">Gráfico de
                                                    Burndown</h3>
                                            </div>
                                            <p className="mb-2 text-gray-600">Visualize em um gráfico de burndown de
                                                forma intuitiva a melhor forma de acabar as tarefas na sprint.</p>
                                        </div>

                                    </div>
                                </div>

                                <div className="w-full sm:w-1/2">
                                    <div className="relative h-full ml-0 md:mr-10">
                                        <span
                                            className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-green-500 rounded-lg"/>
                                        <div
                                            className="relative h-full p-5 bg-white border-2 border-green-500 rounded-lg">
                                            <div className="flex items-center -mt-1">
                                                <svg className="w-8 h-8 text-green-500 fill-current"
                                                     viewBox="0 0 20 20">
                                                    <path
                                                        d="M16.853,8.355V5.888c0-3.015-2.467-5.482-5.482-5.482H8.629c-3.015,0-5.482,2.467-5.482,5.482v2.467l-2.741,7.127c0,1.371,4.295,4.112,9.594,4.112s9.594-2.741,9.594-4.112L16.853,8.355z M5.888,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C6.402,17.137,6.173,17.367,5.888,17.367z M5.203,10c0-0.377,0.19-0.928,0.423-1.225c0,0,0.651-0.831,1.976-0.831c0.672,0,1.141,0.309,1.141,0.309C9.057,8.46,9.315,8.938,9.315,9.315v1.028c0,0.188-0.308,0.343-0.685,0.343H5.888C5.511,10.685,5.203,10.377,5.203,10z M7.944,16.853H7.259v-1.371l0.685-0.685V16.853z M9.657,16.853H8.629v-2.741h1.028V16.853zM8.972,13.426v-1.028c0-0.568,0.46-1.028,1.028-1.028c0.568,0,1.028,0.46,1.028,1.028v1.028H8.972z M11.371,16.853h-1.028v-2.741h1.028V16.853z M12.741,16.853h-0.685v-2.056l0.685,0.685V16.853z M14.112,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C14.626,17.137,14.396,17.367,14.112,17.367z M14.112,10.685h-2.741c-0.377,0-0.685-0.154-0.685-0.343V9.315c0-0.377,0.258-0.855,0.572-1.062c0,0,0.469-0.309,1.141-0.309c1.325,0,1.976,0.831,1.976,0.831c0.232,0.297,0.423,0.848,0.423,1.225S14.489,10.685,14.112,10.685z M18.347,15.801c-0.041,0.016-0.083,0.023-0.124,0.023c-0.137,0-0.267-0.083-0.319-0.218l-2.492-6.401c-0.659-1.647-1.474-2.289-2.905-2.289c-0.95,0-1.746,0.589-1.754,0.595c-0.422,0.317-1.084,0.316-1.507,0C9.239,7.505,8.435,6.916,7.492,6.916c-1.431,0-2.246,0.642-2.906,2.292l-2.491,6.398c-0.069,0.176-0.268,0.264-0.443,0.195c-0.176-0.068-0.264-0.267-0.195-0.444l2.492-6.401c0.765-1.911,1.824-2.726,3.543-2.726c1.176,0,2.125,0.702,2.165,0.731c0.179,0.135,0.506,0.135,0.685,0c0.04-0.029,0.99-0.731,2.165-0.731c1.719,0,2.779,0.814,3.542,2.723l2.493,6.404C18.611,15.534,18.524,15.733,18.347,15.801z"/>
                                                </svg>
                                                <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">Tarefas sem
                                                    limites</h3>
                                            </div>
                                            <p className="mb-2 text-gray-600">O Flush oferece para você totalmente
                                                ilimitado a capacidade de criar tarefas e quadros de dailys.</p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="hidden w-1/3 lg:block overflow-hidden">
                            <div className="absolute w-full max-w-4xl pl-12 -mt-20 xl:-mt-32">
                                <div
                                    className="absolute top-0 left-0 w-full h-full mt-2 ml-10 bg-gray-900 rounded-2xl"/>
                                <div className="relative overflow-hidden border-2  border-black rounded-2xl">
                                    <img src="https://cdn.devdojo.com/images/february2021/task-dashboard.png"
                                         className="object-cover w-full h-full transform"/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="bg-white">
                <div className="px-8 py-8 mx-auto sm:py-10 lg:py-20 max-w-7xl">
                    <div
                        className="relative py-6 overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 lg:py-12 md:px-6 lg:p-16 lg:flex lg:items-center lg:justify-between md:shadow-xl md:bg-purple-1000">
                        <div
                          className="absolute top-0 right-0 hidden w-full -mt-20 transform rotate-45 translate-x-1/2 bg-white sm:block h-96 opacity-5"/>
                        <div
                        className="absolute top-0 left-0 hidden w-full -mt-20 transform rotate-45 -translate-x-1/2 bg-pink-300 sm:block h-96 opacity-5"/>
                        <div className="relative p-6 rounded-lg md:p-0 md:pb-4">
                            <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-white sm:text-4xl sm:leading-10">Gerencie projetos com metodologias ágeis.</h2>
                            <p className="w-full mt-5 text-base leading-6 text-pink-100 md:w-3/4">Crie agora sua conta na flush e cadastre sua equipe para melhorar as entregas e a qualidade de software produzida.</p>
                        </div>
                        <div
                            className="relative flex flex-col items-center w-full px-6 space-y-5 md:space-x-5 md:space-y-0 md:flex-row md:w-auto lg:flex-shrink-0 md:px-0">
                            <button
                                type="button"
                                className="block w-full px-5 py-3 text-base font-medium leading-6 text-center text-purple-600 transition duration-150 ease-in-out bg-purple-100 rounded-md md:inline-flex md:shadow md:w-auto hover:bg-white focus:outline-none focus:shadow-outline"
                                onClick={handleModalEscolha}
                            >
                                Cadastrar-se
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <section className="w-full py-16 pb-20 bg-white">
                <div className="container px-8 mx-auto sm:px-12 lg:px-20">
                    <h1 className="mb-3 text-3xl font-bold leading-tight text-center text-gray-900 md:text-4xl">Empresas
                        que Adotam Metodologias Ágeis</h1>
                    <p className="text-lg text-center text-gray-600 ">As empresas abaixos são conhecidas muldiamente e
                        todas elas gerenciam os seus proojeto utilizando metodoloogias ágeis como o scrum.</p>
                    <div className="grid grid-cols-2 gap-16 py-16 mb-0 text-center lg:grid-cols-6">
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/nintendo-logo.svg" alt="Ninendo Logo"
                                 className="block object-contain h-8 lg:h-10"/>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/google-icon.svg" alt="Google Logo"
                                 className="block object-contain h-12"/>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/reddit.svg" alt="Reddit Logo"
                                 className="block object-contain h-12 lg:h-16"/>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/youtube-logo.svg" alt="Youtube Logo"
                                 className="block object-contain h-9 lg:h-16"/>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/slack-icon.svg" alt="Slack Logo"
                                 className="block object-contain h-12"/>
                        </div>
                        <div className="flex items-center justify-center">
                            <img src="https://cdn.devdojo.com/tails/images/amazon.svg" alt="Amazon Logo"
                                 className="block object-contain h-10 lg:h-16"/>
                        </div>
                    </div>
                </div>
            </section>


            <section className="px-6 py-6 text-gray-600 bg-gray-50 lg:px-8 md:py-12 overflow-hidden">
                <div
                    className="flex flex-col items-center justify-between max-w-screen-xl mx-auto mt-16 md:flex-row lg:mt-20">
                    <Link to="/" className="mr-1 cursor-pointer text-black">
                        <span
                            className="text-3xl font-black leading-none text-black italic select-none logo">Flush</span>
                    </Link>
                    <div className="text-sm">
                        © 2021 Flush.
                    </div>
                </div>
            </section>

            <ToastContainer limit={3}/>
        </>
    )
        ;
}
