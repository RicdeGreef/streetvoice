import React, { useState, useEffect } from 'react';
import './App.css'; // Belangrijk: importeer het nieuwe CSS-bestand

// --- Iconen ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-icon">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// --- GESIMULEERDE AI DATA ---
const mockApiResponse = {
  id: 1,
  sanitizedStory: "Tijdens het hardlopen zei iemand 'pff, wat ben je dik geworden.'",
  perspectives: [
    { id: 'ontvanger', title: 'Ik voelde me onzeker en beledigd', description: 'De opmerking kwam onverwacht en raakte me diep.', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200' },
    { id: 'grapmaker', title: 'Ik zag het als een grapje', description: 'Ik maakte een plagerige opmerking, en bedoelde het niet kwaad.', imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200' }
  ],
  bystanderScenario: { title: "Iemand maakt een seksistische opmerking", choices: [{ id: 'a', text: 'Lach mee' }, { id: 'b', text: 'Zeg iets' }, { id: 'c', text: 'Negeer het' }] },
  communityData: { respectfulPercentage: 73 }
};

// --- HOOFD APP COMPONENT ---
export default function App() {
  const [step, setStep] = useState('submission');
  const [submittedStory, setSubmittedStory] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleStorySubmit = (storyText) => {
    setSubmittedStory(storyText);
    setStep('loading');
    setTimeout(() => {
      setApiResponse(mockApiResponse);
      setStep('perspectives');
    }, 2000);
  };

  const handleMakeChoice = (choice) => {
    console.log("Gemaakte keuze:", choice);
    setStep('feedback');
  };

  const handleRestart = () => {
    setStep('submission');
    setSubmittedStory('');
    setApiResponse(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'submission': return <SubmissionScreen onSubmit={handleStorySubmit} />;
      case 'loading': return <LoadingScreen />;
      case 'perspectives': return <PerspectiveScreen response={apiResponse} onContinue={() => setStep('choice')} />;
      case 'choice': return <ChoiceScreen scenario={apiResponse.bystanderScenario} onChoice={handleMakeChoice} />;
      case 'feedback': return <FeedbackScreen feedback={apiResponse.communityData} onRestart={handleRestart} />;
      default: return <SubmissionScreen onSubmit={handleStorySubmit} />;
    }
  };

  return (
    <div className="app-container">
      <div className="app-card">
        <Header onHomeClick={handleRestart} />
        <main className="app-main">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Header({ onHomeClick }) {
  return (
    <header className="header">
      <h1 className="header-title">StreetVoice</h1>
      <button onClick={onHomeClick} className="home-button">
        <HomeIcon />
      </button>
    </header>
  );
}

function SubmissionScreen({ onSubmit }) {
  const [story, setStory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (story.trim()) onSubmit(story);
  };

  return (
    <div className="screen animate-fade-in">
      <h2>Deel anoniem je verhaal</h2>
      <p className="subtitle">Beschrijf kort een situatie die jij meemaakte of zag. De AI maakt hier een neutraal scenario van.</p>
      <form onSubmit={handleSubmit} className="submission-form">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Bijv: 'In de bus maakte iemand een vervelende grap...'"
        ></textarea>
        <div className="form-footer">
          <button type="submit" disabled={!story.trim()} className="button-primary">
            Verzenden
          </button>
        </div>
      </form>
    </div>
  );
}

function LoadingScreen() {
    return (
        <div className="screen animate-fade-in loading-screen">
            <h2>De AI analyseert het verhaal...</h2>
            <p className="subtitle">Een moment geduld, we maken er een scenario van.</p>
            <div className="spinner"></div>
        </div>
    );
}

function PerspectiveScreen({ response, onContinue }) {
  return (
    <div className="screen animate-fade-in">
      <h2>Anoniem gedeeld verhaal</h2>
      <p className="story-quote">"{response.sanitizedStory}"</p>
      <p className="subtitle">De AI laat zien hoe beide kanten dit kunnen ervaren.</p>
      <div className="perspectives-container">
        {response.perspectives.map(p => (
          <div key={p.id} className="perspective-card">
             <img src={`${p.imageUrl}&c=${p.id}`} alt={p.title} />
            <div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </div>
          </div>
        ))}
      </div>
       <div className="screen-footer">
            <button onClick={onContinue} className="button-primary">
              Ga verder
            </button>
        </div>
    </div>
  );
}

function ChoiceScreen({ scenario, onChoice }) {
  return (
    <div className="screen animate-fade-in">
      <h2>Jouw reactie</h2>
      <p className="subtitle">{scenario.title}. Wat doe jij als omstander?</p>
      <div className="choices-container">
        {scenario.choices.map(choice => (
          <button key={choice.id} onClick={() => onChoice(choice)} className="choice-button">
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedbackScreen({ feedback, onRestart }) {
  return (
    <div className="screen animate-fade-in feedback-screen">
      <h2>Community Feedback</h2>
      <div className="feedback-content">
        <div className="percentage-circle" style={{'--percentage': feedback.respectfulPercentage}}>
            <p>{feedback.respectfulPercentage}%</p>
        </div>
        <p className="feedback-text">van jouw leeftijdsgenoten koos voor respectvol gedrag.</p>
        <p className="subtitle">Samen normaliseren we respect. Jouw keuze maakt impact.</p>
      </div>
       <div className="screen-footer">
            <button onClick={onRestart} className="button-secondary">
              Start nieuw scenario
            </button>
        </div>
    </div>
  );
}

