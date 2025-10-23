import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSpeechRecognition } from './src/hooks/useSpeechRecognition';
import { parseSpanishNumber } from './src/utils/parseSpanishNumber';

function randomOperation() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  //const ops = ['+', '-', '×', '÷'];
  const ops = ['+', '-'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let result = 0;
  let x = a;
  let y = b;

  switch (op) {
    case '+':
      result = a + b;
      break;
    case '-':
      // asegurar que la resta no sea negativa
      if (b > a) {
        x = b;
        y = a;
      }
      result = x - y;
      break;
    case '×':
      result = a * b;
      break;
    case '÷':
      // asegurar divisiones enteras y sin división por 0
      y = b === 0 ? 1 : b;
      x = y * Math.floor(Math.random() * 10);
      result = x / y;
      break;
  }

  return { a: x, b: y, op, result };
}

export default function App() {
  const [operation, setOperation] = useState(randomOperation());
  const [feedback, setFeedback] = useState<string | null>(null);

  const { listening, startListening, stopListening, supported } = useSpeechRecognition((text) => {
    console.log('Texto reconocido:', text);

    // Normaliza a minúsculas
    const cleaned = text.toLowerCase().trim();

    // Extrae lo que viene después de la palabra "resultado"
    const match = cleaned.match(/resultado\s+(\w+)/);

    if (!match) {
      setFeedback('❌ Por favor, di "resultado" antes del número');
      return;
    }

    // Intenta interpretar el número hablado
    const spokenWord = match[1];
    const spokenNumber = parseSpanishNumber(spokenWord);

    const expected = Number(operation.result);
    const given = Number(spokenNumber);

    if (!Number.isFinite(given)) {
      setFeedback(`🤔 No entendí el número (“${spokenWord}”).`);
      return;
    }

    if (given == expected) {
      setFeedback('✅ ¡Correcto!');
    } else {
      setFeedback(`❌ Incorrecto (${spokenWord} - ${given} -> ${expected})`);
    }

    setOperation(randomOperation());
  });


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 28 }}>{`${operation.a} ${operation.op} ${operation.b}`}</Text>
      <Button
        title={listening ? '🎙️ Escuchando...' : 'Hablar'}
        onPress={() => {
          setFeedback(null); // 💥 limpia feedback antes de nueva sesión
          listening ? stopListening() : startListening();
        }}
        disabled={!supported}
      />
      {feedback && <Text style={{ marginTop: 20, fontSize: 22 }}>{feedback}</Text>}
    </View>
  );
}
