import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleButtonImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

import '../styles/auth.scss'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'

export function Home(){
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
    if(!user){
      await signInWithGoogle()
    }

    history.push('/room/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if(roomCode.trim() === ''){
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if(!roomRef.exists()) {
      alert('A sala não existe.')
      return;
    }

    if(roomRef.val().endedAt){
      alert('A sala já foi fechada.')
      return;
    }

    history.push(`/room/${roomCode}`)
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="HomePic" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Logo do Letmeask" />
          <button onClick={handleCreateRoom} className='create-room'>
            Crie sua sala com o Google
            <img src={googleButtonImg} alt="Logo do Google" />
          </button>
          <div className='separator'>ou entre numa sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
            type="text"
            placeholder="Digite o código da sua sala"
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}