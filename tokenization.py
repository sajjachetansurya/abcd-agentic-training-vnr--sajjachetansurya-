def tokenize(text):
    tokens = []
    word = ""
    
    for char in text:
        if char.isalnum():
            word += char
        else:
            if word != "":
                tokens.append(word.lower())
                word = ""
    
    if word != "":
        tokens.append(word.lower())
        
    return tokens

# Example
text = "Hi I am Chetan "

tokens = tokenize(text)

print("Tokens:")
print(tokens)