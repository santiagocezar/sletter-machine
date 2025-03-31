<!--
# Desarrollo de un robot sumo

El campo de la robótica les permite a los estudiantes experimentar con el puente entre lo lógico y lo físico, y descubrir de forma didáctica, cómo se comporta.

Los robots sumo son **robots autónomos** cuyo objetivo es **empujar al oponente** fuera de un círculo, inspirados en el tradicional deporte japonés. El **control preciso del movimiento** de estos robots es de suma importancia para la efectividad de las tácticas, pero existen **numerosos factores** que pueden llegar a **perjudicarlo**, principalemente la **inercia**, **fricción** y la **calidad** del equipamiento.
-->
# Robot de transmisión diferencial

eduACTIVO permite **programar el movimiento** de un robot virtual, **simulando factores** físicos como la **inercia** y la **fricción**, usando un lenguaje de **programación por bloques**, muy similar a Scratch.

El robot utiliza el **control diferencial**, se comporta similar a uno con **dos ruedas** conectadas a **dos motores** controlados de manera **individual**, más una rueda loca para mantener el equilibrio.

![Diagrama de sistema de motores diferenciales](/Tanklike.png)

- Cuando ambas ruedas tienen la **misma velocidad**, el robot avanza en **línea recta**.
- Cuando la **velocidad** de las ruedas **difiere**, el robot **vira**.
    - Si la **rueda izquierda** tiene mayor velocidad, el robot **gira a la derecha** (sentido horario)
    - Si la **rueda derecha** tiene mayor velocidad, el robot **gira a la izquierda** (sentido anti-horario)
- Cuando las ruedas tienen **velocidades opuestas**, el robot gira en el lugar.

![Diagrama de sistema de motores diferenciales](/DifferentialSteering.svg)
