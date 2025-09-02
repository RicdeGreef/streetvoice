import React, { useState } from 'react';
import './App.css'; // Belangrijk: importeer het nieuwe CSS-bestand

// --- Iconen ---
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="home-icon">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

// --- GESIMULEERDE AI DATA (voor als iemand skipt) ---
const mockApiResponse = {
  id: 1,
  originalStory: "In de groepsapp werd een gemene foto van Alex gedeeld en iedereen lachte.",
  perspectives: [
    { id: 'ontvanger', title: 'Perspectief van Alex', description: 'Ik voelde me buitengesloten en gekwetst door de foto.', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200' },
    { id: 'grapmaker', title: 'Perspectief van de deler', description: 'Ik dacht dat het een onschuldige grap was die iedereen wel kon waarderen.', imageUrl: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200' }
  ],
  bystanderScenario: { title: "Een klasgenoot deelt een gemene foto in de groepsapp", choices: [{ id: 'a', text: 'Lach mee' }, { id: 'b', text: 'Zeg er iets van' }, { id: 'c', text: 'Negeer het' }] },
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
      // Hier zou de echte API call komen gebaseerd op storyText
      setApiResponse(mockApiResponse);
      setStep('choice');
    }, 2000);
  };

  const handleSkip = () => {
    setStep('loading');
    setTimeout(() => {
      // Gebruik het standaard scenario als iemand skipt
      setApiResponse(mockApiResponse);
      setStep('choice');
    }, 1500); // Iets kortere wachttijd voor skippen
  };

  const handleMakeChoice = (choice) => {
    console.log("Gemaakte keuze:", choice);
    setStep('perspectives');
  };

  const handleRestart = () => {
    setStep('submission');
    setSubmittedStory('');
    setApiResponse(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'submission': return <SubmissionScreen onSubmit={handleStorySubmit} onSkip={handleSkip} />;
      case 'loading': return <LoadingScreen />;
      case 'choice': return <ChoiceScreen scenario={apiResponse.bystanderScenario} onChoice={handleMakeChoice} />;
      case 'perspectives': return <PerspectiveScreen response={apiResponse} onContinue={() => setStep('feedback')} />;
      case 'feedback': return <FeedbackScreen feedback={apiResponse.communityData} onRestart={handleRestart} />;
      default: return <SubmissionScreen onSubmit={handleStorySubmit} onSkip={handleSkip} />;
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
      <h1 className="header-title">StreetVoice Klas</h1>
      <button onClick={onHomeClick} className="home-button">
        <HomeIcon />
      </button>
    </header>
  );
}

function SubmissionScreen({ onSubmit, onSkip }) {
  const [story, setStory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (story.trim()) {
        onSubmit(story);
    }
    // De 'else' is niet nodig, want de knop is uitgeschakeld.
  };

  return (
    <div className="screen animate-fade-in">
      <h2>Deel anoniem een ervaring</h2>
      <p className="subtitle">Beschrijf een situatie die jij hebt meegemaakt of gezien. De AI maakt er een neutraal scenario van voor de klas.</p>
      <form onSubmit={handleSubmit} className="submission-form">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Bijv: 'Op social media zag ik dat er iemand werd buitengesloten...'"
        ></textarea>
        <div className="form-footer">
          <button type="submit" className="button-primary" disabled={!story.trim()}>
            Verzenden voor scenario
          </button>
          <button type="button" onClick={onSkip} className="button-secondary">
            Ik heb geen verhaal, ga door
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
      <h2>De perspectieven</h2>
      {response.originalStory && <p className="story-quote">Gebaseerd op het anonieme verhaal: "{response.originalStory}"</p>}
      <p className="subtitle">Nadat je een keuze hebt gemaakt, is het goed om te zien hoe anderen de situatie kunnen ervaren.</p>
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
              Bekijk de klassen-feedback
            </button>
        </div>
    </div>
  );
}

function ChoiceScreen({ scenario, onChoice }) {
  return (
    <div className="screen animate-fade-in">
      <h2>Jouw reactie als omstander</h2>
      <p className="subtitle">{scenario.title}. Wat doe jij?</p>
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
      <h2>Klassen-feedback</h2>
      <div className="feedback-content">
        <div className="percentage-circle" style={{'--percentage': feedback.respectfulPercentage}}>
            <p>{feedback.respectfulPercentage}%</p>
        </div>
        <p className="feedback-text">van de deelnemers koos voor respectvol gedrag.</p>
        <p className="subtitle">Samen maken we de norm. Dit is een startpunt voor een klassengesprek.</p>
      </div>
       <div className="screen-footer">
            <button onClick={onRestart} className="button-secondary">
              Start nieuw scenario
            </button>
        </div>
    </div>
  );
}

