import React, { useState } from 'react'
import './App.css'

// --- Iconen ---
const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="home-icon"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
)

// --- DATASTRUCTUUR VOOR DE SITUATIES ---
const situations = [
  {
    id: 1,
    title: 'Situatie 1',
    description:
      'Je krijgt een grappige selfie van een vriend(in) en besluit die door te sturen in de groepsapp zonder eerst te vragen.',
    scaleLabels: { left: 'Onschuldig', right: 'Schadelijk' },
    mockClassData: {
      average: 3.5,
      distribution: { '1-3': 90, '4-7': 10, '8-10': 0 },
    },
    perspectives: [
      {
        id: 'ontvanger',
        title: 'Perspectief van de vriend(in)',
        description:
          'Ik schrok ervan dat mijn foto ineens in die groep stond zonder dat ik het wist.',
      },
      {
        id: 'dader',
        title: 'Gedachtegang van de deler',
        description:
          'Het was maar een grapje, iedereen stuurt toch wel eens wat door? Stelt niks voor.',
      },
    ],
  },
  {
    id: 2,
    title: 'Situatie 2',
    description:
      "Iemand stuurt jou een foto in bikini/zwembroek bedoeld voor jou alleen. Je twijfelt of je die met een paar vrienden deelt 'voor de grap'.",
    scaleLabels: { left: 'Onschuldig', right: 'Schadelijk' },
    mockClassData: {
      average: 6.5,
      distribution: { '1-3': 10, '4-7': 30, '8-10': 60 },
    },
    perspectives: [
      {
        id: 'ontvanger',
        title: 'Perspectief van de zender',
        description:
          'Ik stuurde die foto in vertrouwen en zou me verraden voelen als die wordt doorgestuurd.',
      },
      {
        id: 'dader',
        title: 'Gedachtegang van de deler',
        description:
          "Wow, even aan m'n beste vrienden laten zien. Niemand komt erachter, het blijft onder ons.",
      },
    ],
  },
  {
    id: 3,
    title: 'Situatie 3',
    description:
      'Je ontvangt een naaktfoto van iemand. Zonder toestemming besluit je deze door te sturen naar anderen.',
    scaleLabels: { left: 'Onschuldig', right: 'Schadelijk' },
    mockClassData: {
      average: 9.2,
      distribution: { '1-3': 2, '4-7': 8, '8-10': 90 },
    },
    perspectives: [
      {
        id: 'ontvanger',
        title: 'Perspectief van de persoon op de foto',
        description:
          'Dit is extreem pijnlijk en schadelijk. Mijn privacy is compleet geschonden.',
      },
      {
        id: 'dader',
        title: 'Gedachtegang van de deler',
        description:
          'Dit is te heftig om voor mezelf te houden, anderen moeten dit zien. Wat een idioot om dit te sturen, eigen schuld.',
      },
    ],
  },
]

// --- HOOFD APP COMPONENT ---
export default function App() {
  const [step, setStep] = useState('submission') // 'submission', 'rating', 'results', 'perspectives'
  const [currentSituationIndex, setCurrentSituationIndex] = useState(0)
  const [userRatings, setUserRatings] = useState({})

  const currentSituation = situations[currentSituationIndex]

  const startRatingFlow = () => {
    setStep('rating')
  }

  const handleRatingSubmit = (rating) => {
    setUserRatings({ ...userRatings, [currentSituation.id]: rating })
    setStep('results')
  }

  const handleShowPerspectives = () => {
    setStep('perspectives')
  }

  const handleNextSituation = () => {
    if (currentSituationIndex < situations.length - 1) {
      setCurrentSituationIndex(currentSituationIndex + 1)
      setStep('rating')
    } else {
      handleRestart()
    }
  }

  const handleRestart = () => {
    setCurrentSituationIndex(0)
    setStep('submission')
    setUserRatings({})
  }

  const renderContent = () => {
    switch (step) {
      case 'submission':
        return <SubmissionScreen onContinue={startRatingFlow} />
      case 'rating':
        return (
          <RatingScreen
            situation={currentSituation}
            onSubmit={handleRatingSubmit}
          />
        )
      case 'results':
        return (
          <ResultsScreen
            situation={currentSituation}
            onContinue={handleShowPerspectives}
          />
        )
      case 'perspectives':
        return (
          <PerspectiveScreen
            situation={currentSituation}
            onContinue={handleNextSituation}
            isLast={currentSituationIndex === situations.length - 1}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      <div className="app-card">
        <Header onHomeClick={handleRestart} />
        <main className="app-main">{renderContent()}</main>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

function Header({ onHomeClick }) {
  return (
    <header className="header">
      <h1 className="header-title">StreetVoice Klas</h1>
      <button onClick={onHomeClick} className="home-button">
        <HomeIcon />
      </button>
    </header>
  )
}

function SubmissionScreen({ onContinue }) {
  const [shareOption, setShareOption] = useState('')

  return (
    <div className="screen animate-fade-in">
      <h2>Deel je ervaring</h2>
      <p className="subtitle">
        Heb je iets meegemaakt of gezien dat je wilt delen? Opschrijven kan
        helpen het een plek te geven.
      </p>

      <textarea
        className="submission-textarea"
        placeholder="Schrijf hier je verhaal..."
      ></textarea>

      <div className="share-options">
        <h3>Hoe wil je dit delen?</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="share"
              value="class"
              onChange={(e) => setShareOption(e.target.value)}
            />
            <span>Anoniem delen met de klas</span>
          </label>
          <label>
            <input
              type="radio"
              name="share"
              value="app"
              onChange={(e) => setShareOption(e.target.value)}
            />
            <span>Alleen anoniem met de app</span>
          </label>
          <label>
            <input
              type="radio"
              name="share"
              value="private"
              onChange={(e) => setShareOption(e.target.value)}
            />
            <span>Niet delen, alleen voor mij</span>
          </label>
        </div>
      </div>

      <div className="screen-footer">
        <button onClick={onContinue} className="button-primary">
          Start de oefening
        </button>
        <button onClick={onContinue} className="button-link">
          Ik heb geen ervaring om te delen
        </button>
      </div>
    </div>
  )
}

function RatingScreen({ situation, onSubmit }) {
  const [rating, setRating] = useState(5)

  return (
    <div className="screen animate-fade-in">
      <h2>{situation.title}</h2>
      <p className="subtitle">{situation.description}</p>
      <div className="rating-container">
        <h3>Jouw grens</h3>
        <p className="rating-question">
          Hoe schadelijk vind jij dit op een schaal van 0 tot 10?
        </p>

        <div className="slider-container">
          <span className="slider-value">{rating}</span>
          <input
            type="range"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="scale-labels">
          <span>{situation.scaleLabels.left}</span>
          <span>{situation.scaleLabels.right}</span>
        </div>
      </div>
      <div className="screen-footer">
        <button className="button-primary" onClick={() => onSubmit(rating)}>
          Toon klassenresultaat
        </button>
      </div>
    </div>
  )
}

function ResultsScreen({ situation, onContinue }) {
  const { average, distribution } = situation.mockClassData
  return (
    <div className="screen animate-fade-in">
      <h2>{situation.title}</h2>
      <div className="results-container">
        <h3>Klassikale Score</h3>
        <p className="average-score">{average.toFixed(1).replace('.', ',')}</p>
        <div className="chart">
          <div className="bar-group">
            <div
              className="bar"
              style={{ height: `${distribution['1-3']}%` }}
            >
              <span>{distribution['1-3']}%</span>
            </div>
            <label>1-3</label>
          </div>
          <div className="bar-group">
            <div
              className="bar"
              style={{ height: `${distribution['4-7']}%` }}
            >
              <span>{distribution['4-7']}%</span>
            </div>
            <label>4-7</label>
          </div>
          <div className="bar-group">
            <div
              className="bar"
              style={{ height: `${distribution['8-10']}%` }}
            >
              <span>{distribution['8-10']}%</span>
            </div>
            <label>8-10</label>
          </div>
        </div>
      </div>
      <div className="screen-footer">
        <button onClick={onContinue} className="button-primary">
          Bekijk de perspectieven
        </button>
      </div>
    </div>
  )
}

function PerspectiveScreen({ situation, onContinue, isLast }) {
  return (
    <div className="screen animate-fade-in">
      <h2>De perspectieven</h2>
      <p className="subtitle">
        Het is goed om te zien hoe anderen de situatie kunnen ervaren.
      </p>
      <div className="perspectives-container">
        {situation.perspectives.map((p) => (
          <div key={p.id} className="perspective-card">
            <div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="screen-footer">
        <button onClick={onContinue} className="button-primary">
          {isLast ? 'Sessie afronden' : 'Volgende situatie'}
        </button>
      </div>
    </div>
  )
}

