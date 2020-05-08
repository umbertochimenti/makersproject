//includiamo la libreria nel programma in modo tale da integrsre tutte le funzioni dell'esp che ci serviranno in seguito
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>  
//siccome abbiamo bisogni di fare delle prove per vedere se i motori funzionano correttamente attribuiamo dei pin dell'esp (D1,D2,D3,D4)
//ai pin di Arduino (5,4,0,2)
#define D1 5
#define D2 4
#define D3 0
#define D4 2

//questo serve per immetterre il nome della connessione (Chris) e la relativa password(christan) in modo tale che l'esp possa connettersi alla rete
// e in questo modo possiamo telecomandare l'esp da remoto, in pratica creiamo una connessione
cons t char* ssid = "Chris";
const char* password = "christan";

using namespace websockets;
WebsocketsServer server;


// il void setup cos'è? 
//è una funzione che viene eseguita solo una volta quando parte lo sketch subito dopo l'accensione;in questo caso, dell'esp
//viene usata per l'inizializzazione necessaria per il programma ovvero l'impostazione delle variabili e le modalità di uso dei pin
void setup() {

  Serial.begin(9600);
  // Connessione al wifi
  WiFi.begin(ssid, password);

  // attendere qualche minuto per connettersi al wifi
  for(int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  //il comando "Serial.println serve per scrivere sul terminale, quando l'esp si sarà connessa alla rete, l'indirizzo IP della rete
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());   //Ora puoi ottenere l'indirizzo IP assegnato a esp

  server.listen(8000);
  //ora riusciremo a vedere se l'esp si sia connessa come? beh aprendo il terminale se uscirà il numero "1" si sarà connessa se invece uscirà il numero "0" non si sarà connessa
  Serial.print("Is server live? ");
  Serial.println(server.available());
// ora andremo ad inizializzare i pin definendoli di output (potevano essere anche di input) perchè sono in uscita 
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  //ai pin dichiarti qui sopra gli scirviamo "LOW" in questo modo il microprocessore da un impouslo pari a 0 volt
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}


//il void loop è esattamente l'opposto del void setup, ovvero, nel void loop le instruzioni che mettiamo all'interno vengono ripetute ciclicamente
//noi in questo caso abbiamo reso il programma dinamico, ovvero decideremo noi qunado far partire la brarca, ma avremmo potuto fare ancheun programma statico
//ad esempio potevamo far accende e spegne un led all'infinito fino a quando non gli avremmo tolto l'alimentazione
void loop(){

// il Websockets è una libreria dell'esp che serve per le connessioni
  WebsocketsClient client = server.accept();
  if(client.available()) {
    WebsocketsMessage msg = client.readBlocking();


    Serial.print("Got Message: ");
    Serial.println(msg.data());
// qui inizia il programma vero e proprio, attraverso una pagina sul web che avrà un joypad si potrà decidere in che direzione far andare la barca
//ora andremo a vedere per bene cosa voglia dire tutto questo qui sotto.
//"if" in inglese vuol dire "se" infatti questo vuol dire se il messaggio mandato dalla pagin web è "command|on" allora fai andare partire entrambi i motori
    if (msg.data() == "command|on#") {
//il comando "digitalWrite" serve per aggiornare lo stato del motore ovvero in questo caso gli diciamo che deve essere "HIGH" questo vuol dire
//che il microprocessore deve dare un impulso di 3 volt ai pin D1 e D2 
      digitalWrite(D1, HIGH);
      digitalWrite(D2, HIGH);
// il comando "else if" vorrebbe dire che se la condizione di prima non si è verificata allora verifica se questa condizione sia veritiera
    } else if (msg.data() == "command|left#") {
//vediamo che nella condizione c'è scritto "left" ovvero che vuol dire che la barca dovrà girare a sinistra infatti per far si che questo sia possibile
//un motore sarà spento mentre l'altra si azionerà in modo tale da girare a sinistra
      digitalWrite(D1, LOW);
      digitalWrite(D2, HIGH);
    } else if (msg.data() == "command|right#") {
// qui è la stessa cosa di girare a sinistra, solo che adesso i motori inveritiranno gli impusli
      digitalWrite(D1, HIGH);
      digitalWrite(D2, LOW);
    } else if (msg.data() == "command|stop#") {
// ovviamente vogliamo che la barca si fermi q euandi quando noi andrem a rilasciare il joypad tutti i motori saranno spenti in modo che barca non cammini
      digitalWrite(D1, LOW);
      digitalWrite(D2, LOW);
    }
    
    // return echo
    client.send("Echo: " + msg.data());

    // close the connection
    client.close();
  }
 // il delay serve, in questo caso, a dare un po' di tempo tra un ciclo e un altro
  delay(100);
}
