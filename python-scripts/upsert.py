import pinecone
import numpy as np

pinecone_api_key = 'c4a952ce-7672-4a81-b6ef-f6f7a5fb487a'
environment = 'gcp-starter'
index_name = "christiandoctrine-ai"


pinecone.init(api_key=pinecone_api_key, environment=environment)
index = pinecone.Index(index_name)
vector = np.random.rand(1536).tolist()

index.upsert(vectors=[("vector_id", vector)])