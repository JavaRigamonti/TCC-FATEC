import React, { useState, useEffect } from "react";

import api from "../../../services/api";

import {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
} from "../../../utils/localStorage";

import { Lottie } from "@crello/react-lottie";
import animTeamPage from "../../../assets/animations/team-page.json";

import { useHistory } from "react-router-dom";

import { v4 as uuid } from "uuid";

import "./styles.css";

import { toast, ToastContainer } from "react-toastify";

import { FiLogIn } from "react-icons/fi";

import Header from "../../../components/Header";
import MenuLaretal from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import CardTeam from "../../../components/CardTeam";
import ButtonAction from "../../../components/ButtonAction";
import Loading from "../../../components/Loading";

import ModalEntrarTime from "../../../components/ModalEntrarTime";

export default function TeamsColab() {
  const [showModalEnterTeam, setShowModalEnterTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const toDetailPage = (teamId, teamName) => {
    history.push(`/times/detalhes/${teamName}`, { teamId });
  };

  useEffect(() => {
    const user = getLocalStorage("@Flush:user");
    const token = getLocalStorage("@Flush:token");

    const fetchData = async () => {
      try {
        const response = await api.get(`/teams/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeams(response.data.teams);

        setLocalStorage("@Flush:token", response.data.token);
        setLoading(false);

      } catch (error) {
        clearLocalStorage();
        history.push("/", { error: 1 });
      }
    };
    fetchData();
  }, [history]);

  const enterTeam = async (code) => {
    const user = getLocalStorage("@Flush:user");
    const token = getLocalStorage("@Flush:token");

    try {
      const response = await api.post(
        `/teams/entry/${user.id}`,
        {
          code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let newTeam = {
        id: response.data.team.id,
        team: {
          ...response.data.team,
        },
      };

      setShowModalEnterTeam(false);
      setTeams([...teams, newTeam]);
      toast.info(`Agora voc?? faz parte do time ${response.data.team.name}`);
    } catch (error) {
      if (error.response.data.err) {
        switch (error.response.status) {
          case 400:
            toast.error("Digite um c??digo v??lido.");
            break;

          case 403:
            toast.error("Acesso negado.");
            break;

          case 409:
            toast.error("Voc?? j?? faz parte desse time.");
            break;

          default:
            toast.error("Erro ao entrar em time.");
            break;
        }
      }
    }
  };

  return (
    <>
      {showModalEnterTeam && (
        <ModalEntrarTime
          enterTeam={enterTeam}
          handleModalEnterTeam={() => setShowModalEnterTeam(false)}
        />
      )}
      <div className="teamsColaborador">
        <Header />
        <MenuLaretal homeActive={false} />
        {loading ? (
          <Loading />
        ) : (
          <Container>
            <div className="container-title">
              <h1> Times </h1>
              <ButtonAction
                onClick={() => setShowModalEnterTeam(!showModalEnterTeam)}
                ButtonText="Entrar em time"
                ButtonIcon={FiLogIn}
              />
            </div>
            <div className="teams-divider"></div>

            <div className="container-teams">
              {teams.length === 0 && (
                <>
                  <Lottie
                    config={{
                      animationData: animTeamPage,
                      loop: true,
                      autoplay: true,
                    }}
                  />
                </>
              )}

              {teams.map((team) => (
                <CardTeam
                  key={uuid()}
                  teamName={team.team.name}
                  teamCategory={team.team.category}
                  teamCode={team.team.code}
                  teamMembers={team.team.users}
                  teamId={team.team.id}
                  toDetailPage={() =>
                    toDetailPage(team.team.id, team.team.name)
                  }
                />
              ))}
            </div>
          </Container>
        )}
        <ToastContainer limit={3}/>
      </div>
    </>
  );
}
