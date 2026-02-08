import type { GameLanguage } from "@/core/types/game";

export type Strings = typeof STRINGS.es;

export const LANGUAGES: GameLanguage[] = ["es", "ca", "en"];

export const STRINGS = {
  es: {
    appTitle: "CEREBRiN",
    languageName: {
      es: "Español",
      ca: "Català",
      en: "English",
    },
    menu: {
      stepOperations: "1. Tipo de operaciones",
      stepMode: "2. Modo de juego",
      stepLevel: "3. Nivel",
      operations: {
        sum: "SUMAS",
        sub: "RESTAS",
        sumSub: "SUMAS Y RESTAS",
      },
      modes: {
        free: "LIBRE (sin tiempo)",
        timeattack: "SUPERVIVENCIA (100 s)",
      },
      difficulty: ["Muy fácil", "Fácil", "Media", "Difícil", "Experto"],
      languageLabel: "Idioma",
      start: "Comenzar",
      records: "Ver récords",
    },
    game: {
      freeTitle: "🆓 Modo libre",
      timeattackTitle: "🛡️ Supervivencia",
      difficulty: "Dificultad: {n}",
      timeRemaining: "Tiempo restante",
      timeUnlimited: "Tiempo ilimitado",
      ready: "Listo para comenzar",
      correct: "Correctas",
      wrong: "Erróneas",
      score: "Puntuación",
      stopMic: "🎙️ Detener micro",
      resumeMic: "🎧 Reanudar micro",
      finish: "⏹️ Finalizar",
      restart: "🔁 Reiniciar",
      exit: "🏠 Salir",
      howToAnswer: "❓ Cómo responder",
      levelDown: "⬇️ Nivel -",
      levelUp: "⬆️ Nivel +",
      startLabel: "▶ Iniciar (activa micro)",
      wrongOpsTitle: "❌ Operaciones falladas",
      correctLabel: "correcto",
      points: "pts",
      feedbackCorrect: "✅ ¡Correcto!",
      feedbackWrong: "❌ Incorrecto ({n})",
      summaryFreeTitle: "⏹️ Fin de la sesión",
      summaryTimeTitle: "⏱️ ¡Tiempo terminado!",
    },
    mic: {
      listening: "🗣️ Dime la respuesta...",
      recognizing: "🎧 Escuchando...",
      processing: "⏳ Procesando...",
      idle: "🎤 Esperando...",
      error: "⚠️ Error en el micrófono",
    },
    summary: {
      title: "Resumen",
      duration: "⏱️ Duración: {n}",
      correct: "Correctas",
      wrong: "Erróneas",
      accuracy: "Precisión",
      newRecord: "🏆 ¡Nuevo récord en el Top 5!",
      topScores: "🏆 Mejores puntuaciones",
      retry: "🔁 Reintentar",
      exit: "🏠 Salir",
    },
    records: {
      title: "🏆 Clasificaciones",
      empty: "Aún no hay récords guardados.",
      free: "🆓 Modo libre",
      timeattack: "🛡️ Supervivencia",
      difficulty: "Dificultad {n}",
      noTime: "sin tiempo",
      back: "⬅️ Volver",
    },
    help: {
      title: "📘 Ayuda",
      sections: {
        intro: {
          title: "Introducción",
          text:
            "Soy Osiris y te enseñaré cómo jugar. Resolverás operaciones de matemáticas usando tu voz. ¡Es fácil y divertido!",
        },
        modes: {
          title: "Modos de juego",
          text:
            "🆓 Modo libre: Practica sin límite de tiempo. Puedes terminar cuando quieras.\n🛡️ Supervivencia: Tienes 100 segundos para resolver el mayor número de operaciones.",
        },
        levels: {
          title: "Niveles de dificultad",
          text:
            "Dificultad 1️⃣: Sumas y restas fáciles con números del 0 al 9. Algunas operaciones con llevar o prestar.\n\n" +
            "Dificultad 2️⃣: Operaciones con dos cifras pequeñas (hasta 25). Puede aparecer algún acarreo.\n\n" +
            "Dificultad 3️⃣: Sumas y restas con múltiplos de 5 o 10 (hasta 50). Mejora tu velocidad mental.\n\n" +
            "Dificultad 4️⃣: Sumas y restas de dos cifras completas, con resultados hasta 99. Más acarreos.\n\n" +
            "Dificultad 5️⃣: Operaciones de dos y tres cifras, con varios acarreos o préstamos. ¡El reto final!",
        },
        howToAnswer: {
          title: "Cómo responder",
          text:
            "Di primero la palabra mágica y luego el número.\nEjemplo: “Resultado 25”.\n\nEspañol: RESULTADO\nCatalà: RESULTAT\nEnglish: RESULT\n\nSi el juego no te entiende, repítelo despacito.",
        },
        summary: {
          title: "Fin del juego",
          text:
            "Al final del juego verás un resumen con tus aciertos, errores y puntuación total. ¡Así podrás mejorar tus récords!",
        },
      },
    },
  },
  ca: {
    appTitle: "CEREBRiN",
    languageName: {
      es: "Español",
      ca: "Català",
      en: "English",
    },
    menu: {
      stepOperations: "1. Tipus d'operacions",
      stepMode: "2. Mode de joc",
      stepLevel: "3. Nivell",
      operations: {
        sum: "SUMES",
        sub: "RESTES",
        sumSub: "SUMES I RESTES",
      },
      modes: {
        free: "LLIURE (sense temps)",
        timeattack: "SUPERVIVÈNCIA (100 s)",
      },
      difficulty: ["Molt fàcil", "Fàcil", "Mitjana", "Difícil", "Expert"],
      languageLabel: "Idioma",
      start: "Començar",
      records: "Veure rècords",
    },
    game: {
      freeTitle: "🆓 Mode lliure",
      timeattackTitle: "🛡️ Supervivència",
      difficulty: "Dificultat: {n}",
      timeRemaining: "Temps restant",
      timeUnlimited: "Temps il·limitat",
      ready: "Preparat per començar",
      correct: "Correctes",
      wrong: "Errònies",
      score: "Puntuació",
      stopMic: "🎙️ Aturar micro",
      resumeMic: "🎧 Reprendre micro",
      finish: "⏹️ Finalitzar",
      restart: "🔁 Reiniciar",
      exit: "🏠 Sortir",
      howToAnswer: "❓ Com respondre",
      levelDown: "⬇️ Nivell -",
      levelUp: "⬆️ Nivell +",
      startLabel: "▶ Iniciar (activa micro)",
      wrongOpsTitle: "❌ Operacions fallades",
      correctLabel: "correcte",
      points: "pts",
      feedbackCorrect: "✅ Correcte!",
      feedbackWrong: "❌ Incorrecte ({n})",
      summaryFreeTitle: "⏹️ Fi de la sessió",
      summaryTimeTitle: "⏱️ Temps acabat!",
    },
    mic: {
      listening: "🗣️ Digues la resposta...",
      recognizing: "🎧 Escoltant...",
      processing: "⏳ Processant...",
      idle: "🎤 Esperant...",
      error: "⚠️ Error de micròfon",
    },
    summary: {
      title: "Resum",
      duration: "⏱️ Durada: {n}",
      correct: "Correctes",
      wrong: "Errònies",
      accuracy: "Precisió",
      newRecord: "🏆 Nou rècord al Top 5!",
      topScores: "🏆 Millors puntuacions",
      retry: "🔁 Reintentar",
      exit: "🏠 Sortir",
    },
    records: {
      title: "🏆 Classificacions",
      empty: "Encara no hi ha rècords guardats.",
      free: "🆓 Mode lliure",
      timeattack: "🛡️ Supervivència",
      difficulty: "Dificultat {n}",
      noTime: "sense temps",
      back: "⬅️ Tornar",
    },
    help: {
      title: "📘 Ajuda",
      sections: {
        intro: {
          title: "Introducció",
          text:
            "Sóc l'Osiris i t'ensenyaré com jugar. Resoldràs operacions de matemàtiques amb la teva veu. És fàcil i divertit!",
        },
        modes: {
          title: "Modes de joc",
          text:
            "🆓 Mode lliure: Practica sense límit de temps. Pots acabar quan vulguis.\n🛡️ Supervivència: Tens 100 segons per resoldre el màxim nombre d'operacions.",
        },
        levels: {
          title: "Nivells de dificultat",
          text:
            "Dificultat 1️⃣: Sumes i restes fàcils amb números del 0 al 9. Algunes operacions amb portar o prestar.\n\n" +
            "Dificultat 2️⃣: Operacions amb dues xifres petites (fins a 25). Pot aparèixer algun arrossegament.\n\n" +
            "Dificultat 3️⃣: Sumes i restes amb múltiples de 5 o 10 (fins a 50). Millora la velocitat mental.\n\n" +
            "Dificultat 4️⃣: Sumes i restes de dues xifres completes, amb resultats fins a 99. Més arrossegaments.\n\n" +
            "Dificultat 5️⃣: Operacions de dues i tres xifres, amb diversos arrossegaments o préstecs. El repte final!",
        },
        howToAnswer: {
          title: "Com respondre",
          text:
            "Digues primer la paraula màgica i després el número.\nExemple: “Resultat 25”.\n\nEspañol: RESULTADO\nCatalà: RESULTAT\nEnglish: RESULT\n\nSi el joc no t'entén, repeteix-ho a poc a poc.",
        },
        summary: {
          title: "Fi del joc",
          text:
            "Al final del joc veuràs un resum amb els teus encerts, errors i puntuació total. Així podràs millorar els teus rècords!",
        },
      },
    },
  },
  en: {
    appTitle: "CEREBRiN",
    languageName: {
      es: "Español",
      ca: "Català",
      en: "English",
    },
    menu: {
      stepOperations: "1. Operation type",
      stepMode: "2. Game mode",
      stepLevel: "3. Level",
      operations: {
        sum: "ADDITIONS",
        sub: "SUBTRACTIONS",
        sumSub: "ADDITIONS & SUBTRACTIONS",
      },
      modes: {
        free: "FREE (no timer)",
        timeattack: "SURVIVAL (100 s)",
      },
      difficulty: ["Very easy", "Easy", "Medium", "Hard", "Expert"],
      languageLabel: "Language",
      start: "Start",
      records: "Records",
    },
    game: {
      freeTitle: "🆓 Free mode",
      timeattackTitle: "🛡️ Survival",
      difficulty: "Difficulty: {n}",
      timeRemaining: "Time remaining",
      timeUnlimited: "Unlimited time",
      ready: "Ready to start",
      correct: "Correct",
      wrong: "Wrong",
      score: "Score",
      stopMic: "🎙️ Stop mic",
      resumeMic: "🎧 Resume mic",
      finish: "⏹️ Finish",
      restart: "🔁 Restart",
      exit: "🏠 Exit",
      howToAnswer: "❓ How to answer",
      levelDown: "⬇️ Level -",
      levelUp: "⬆️ Level +",
      startLabel: "▶ Start (mic on)",
      wrongOpsTitle: "❌ Incorrect operations",
      correctLabel: "correct",
      points: "pts",
      feedbackCorrect: "✅ Correct!",
      feedbackWrong: "❌ Incorrect ({n})",
      summaryFreeTitle: "⏹️ Session finished",
      summaryTimeTitle: "⏱️ Time's up!",
    },
    mic: {
      listening: "🗣️ Say the answer...",
      recognizing: "🎧 Listening...",
      processing: "⏳ Processing...",
      idle: "🎤 Waiting...",
      error: "⚠️ Microphone error",
    },
    summary: {
      title: "Summary",
      duration: "⏱️ Duration: {n}",
      correct: "Correct",
      wrong: "Wrong",
      accuracy: "Accuracy",
      newRecord: "🏆 New Top 5 record!",
      topScores: "🏆 Best scores",
      retry: "🔁 Retry",
      exit: "🏠 Exit",
    },
    records: {
      title: "🏆 Rankings",
      empty: "No records saved yet.",
      free: "🆓 Free mode",
      timeattack: "🛡️ Survival",
      difficulty: "Difficulty {n}",
      noTime: "no timer",
      back: "⬅️ Back",
    },
    help: {
      title: "📘 Help",
      sections: {
        intro: {
          title: "Introduction",
          text:
            "I'm Osiris and I'll show you how to play. You'll solve math operations using your voice. It's easy and fun!",
        },
        modes: {
          title: "Game modes",
          text:
            "🆓 Free mode: Practice with no time limit. You can finish whenever you want.\n🛡️ Survival: You have 100 seconds to solve as many operations as possible.",
        },
        levels: {
          title: "Difficulty levels",
          text:
            "Difficulty 1️⃣: Easy additions and subtractions with numbers 0–9. Some carry/borrow.\n\n" +
            "Difficulty 2️⃣: Small two-digit operations (up to 25). Some carry may appear.\n\n" +
            "Difficulty 3️⃣: Operations with multiples of 5 or 10 (up to 50). Improve mental speed.\n\n" +
            "Difficulty 4️⃣: Full two-digit operations, results up to 99. More carry/borrow.\n\n" +
            "Difficulty 5️⃣: Two- and three-digit operations with multiple carries/borrows. Final challenge!",
        },
        howToAnswer: {
          title: "How to answer",
          text:
            "Say the magic word first, then the number.\nExample: “Result 25”.\n\nEspañol: RESULTADO\nCatalà: RESULTAT\nEnglish: RESULT\n\nIf the game doesn't understand you, repeat it slowly.",
        },
        summary: {
          title: "End of game",
          text:
            "At the end you'll see a summary with your correct answers, mistakes and total score. This helps you beat your records!",
        },
      },
    },
  },
};
