import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface AiRequest {
  model: string;
  messages: AiMessage[];
  response_format?: object;
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: { url: string };
  }>;
}




@Injectable({
  providedIn: 'root'
})

export class AiService {

  async formatTransactions(data: any, type: 'image' | 'text'){
    const date = new Date();
    const ymd = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
    let content = {};
    if(type == 'image'){
      content = {type: 'image_url', image_url: {url: data}}
    }else if(type == 'text'){
      content = {type: 'text', text: data}
    }

    const request = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você receberá uma lista de transações financeiras que podem incluir notas fiscais, extratos bancários e recibos diversos de fontes variadas. Sua tarefa é analisar esses dados, identificar cada transação e extrair as informações essenciais de maneira precisa e padronizada. Ignore qualquer informação que não seja diretamente relevante para preencher o formato especificado. Em casos de notas fiscais com vários itens comprados, retorne dados para cada item e não o valor total da nota fiscal. E especifique o valor como negativo, já que se trata de um gasto." 
        },
        {
          role: "user",
          content: [
            content
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "transaction_array_schema",
          strict: true,
          schema: {
            type: "object",
            properties: {
              transactions: {
                type: "array",
                description: "A list of transaction objects.",
                items: {
                  type: "object",
                  properties: {
                    date: {
                      type: "string",
                      description: "A data da transação no formato 'AAAA-MM-DD'. Caso os dados não estejam completos, considere a data atual como referência: " + ymd
                    },
                    title: {
                      type: "string",
                      description: "Títulos devem ser claras e breves, baseadas no texto original, sem informações redundantes."
                    },
                    amount: {
                      type: "number",
                      description: "Valores monetários devem estar em formato numérico, sem símbolos de moeda e com ponto para separar decimais. Use valores negativos para representar gastos e positivos para representar renda. Analise o contexto de todo a informação para determinar se é um gasto ou receita."
                    }
                  },
                  required: [
                    "date",
                    "title",
                    "amount"
                  ],
                  additionalProperties: false
                }
              }
            },
            required: [
              "transactions"
            ],
            additionalProperties: false
          }
        }
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
       
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });



    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
  }



}
