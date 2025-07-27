import csv
import time
import pinecone
#from pymongo import MongoClient
from langchain.embeddings import OpenAIEmbeddings
from langchain.document_loaders import DirectoryLoader, PyMuPDFLoader, UnstructuredURLLoader
from langchain.vectorstores import Pinecone
from langchain.text_splitter import RecursiveCharacterTextSplitter

import os

# Constants
pinecone_api_key = os.getenv('PINECONE_API_KEY')
environment = os.getenv('PINECONE_ENVIRONMENT', 'gcp-starter')
index_name = os.getenv('PINECONE_INDEX_NAME', 'christiandoctrine-ai')
dimension = 1536
metric = 'cosine'
pod_type = 'p2.x1'
openai_api_key = os.getenv('OPENAI_API_KEY')
pdf_directory = 'PDF'
csvfile = ''
uri = os.getenv('MONGODB_URI')
db_name = os.getenv('MONGODB_DB_NAME', 'test')


# Helper function for confirmation
def confirm_action(message):
  while True:
    confirmation = input(message + " (Y/N): ")
    if confirmation.lower() == 'y':
      return True
    elif confirmation.lower() == 'n' or confirmation == '':
      return False
    else:
      print("Invalid choice. Please enter 'Y' for Yes or 'N' for No.")


# Initialize Pinecone
def init_pinecone():
  pinecone.init(api_key=pinecone_api_key, environment=environment)


# Script 1
def create_index():
  if confirm_action("Are you sure you want to create an index?"):
    init_pinecone()
    pinecone.create_index(index_name,
                          dimension=dimension,
                          metric=metric,
                          pod_type=pod_type)


# Script 2
def delete_index():
  if confirm_action("Are you sure you want to delete an index?"):
    init_pinecone()
    pinecone.delete_index(index_name)


# Script 3
def ingest():
  if confirm_action("Are you sure you want to ingest the PDF folder?"):
    loader = DirectoryLoader(pdf_directory,
                             glob="**/*.pdf",
                             loader_cls=PyMuPDFLoader)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000,
                                                   chunk_overlap=100)
    documents = text_splitter.split_documents(documents)
    print('Number of chunks: ', len(documents))

    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002',
                                  openai_api_key=openai_api_key)

    init_pinecone()

    Pinecone.from_documents(documents,
                            embeddings,
                            index_name=index_name)
    print('Finished Ingesting, stored at Pinecone')


# Script 4
def links2embeddings():
  # Helper functions for links2embeddings
  def read_url_csv(file_path, start_line, end_line):
    with open(file_path, 'r', newline='') as csvfile:
      reader = csv.reader(csvfile)
      url_list = [
        row[0] for idx, row in enumerate(reader)
        if start_line <= idx <= end_line
      ]
    return url_list

  def get_number_of_lines(file_path):
    with open(file_path, 'r') as csvfile:
      return sum(1 for line in csvfile)

  def read_in_chunks(file_path, chunk_size=10):
    total_lines = get_number_of_lines(file_path)
    url_chunks = []

    for i in range(0, total_lines, chunk_size):
      start_line = i
      end_line = min(i + chunk_size - 1, total_lines - 1)
      url_list = read_url_csv(file_path, start_line, end_line)
      url_chunks.append(url_list)
    return url_chunks

  if confirm_action("Are you sure you want to convert links to embeddings?"):
    # Split the content into manageable chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000,
                                                   chunk_overlap=100)

    # Initialize embeddings and Pinecone VectorStore with a namespace
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002',
                                  openai_api_key=openai_api_key)

    # Create a list of URLs from the CSV file
    url_chunks = read_in_chunks(csvfile)
    for url_list in url_chunks:
      print("Processing URLs: ", len(url_list))
      loader = UnstructuredURLLoader(urls=url_list)
      documents = loader.load() # Issue
      print("3")
      time.sleep(1)
      print("4")
      init_pinecone()
      print("5")
      # Split the documents into chunks
      chunks = text_splitter.split_documents(documents)
      print("6")
      print("Number of chunks: ", len(chunks))

      # Create embeddings and store them in Pinecone
      Pinecone.from_documents(chunks,
                              embeddings,
                              index_name=index_name,
                              metadata=True)


def print_records(uri, db_name):
  client = MongoClient(uri)
  db = client[db_name]
  for collection_name in db.list_collection_names():
    collection = db[collection_name]
    documents = collection.find({})
    for document in documents:
      print(document)


# Script 5
def query_mongodb():
  print_records(uri, db_name)
  pass


# Script 6
def query_index():
  init_pinecone()

  list_indexes = pinecone.list_indexes()
  describe_index = pinecone.describe_index(index_name)

  index = pinecone.Index(index_name)

  stats = index.describe_index_stats()
  print(list_indexes)
  print(describe_index)
  print(stats)


def admin_menu():
  while True:
    print("Admin Menu")
    print("1: Create index")
    print("2: Delete index")
    print("3: Return to main menu")
    choice = input("Please enter your choice: ")
    if choice == '1':
      create_index()
    elif choice == '2':
      delete_index()
    elif choice == '3':
      break
    else:
      print("Invalid choice. Please enter a number from the menu.")


def ingest_menu():
  while True:
    print("Ingest Menu")
    print("1: Ingest PDF folder")
    print("2: CSV Links to embeddings")
    print("3: Return to main menu")
    choice = input("Please enter your choice: ")
    if choice == '1':
      ingest()
    elif choice == '2':
      links2embeddings()
    elif choice == '3':
      break
    else:
      print("Invalid choice. Please enter a number from the menu.")


def query_menu():
  while True:
    print("Querying Menu")
    print("1: Query MongoDB")
    print("2: Query Pinecone")
    print("3: Return to main menu")
    choice = input("Please enter your choice: ")
    if choice == '1':
      query_mongodb()
    elif choice == '2':
      query_index()
    elif choice == '3':
      break
    else:
      print("Invalid choice. Please enter a number from the menu.")


def main():
  while True:
    print("Main Menu")
    print("1: Admin")
    print("2: Ingest")
    print("3: Querying")
    print("4: Exit")
    choice = input("Please enter your choice: ")
    if choice == '1':
      admin_menu()
    elif choice == '2':
      ingest_menu()
    elif choice == '3':
      query_menu()
    elif choice == '4':
      break
    else:
      print("Invalid choice. Please enter a number from the menu.")


if __name__ == "__main__":
  main()
